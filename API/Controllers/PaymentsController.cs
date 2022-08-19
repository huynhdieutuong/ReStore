using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class PaymentsController : BaseApiController
  {
    private readonly StoreContext _context;
    private readonly PaymentService _paymentService;
    private readonly UserManager<User> _userManager;

    public PaymentsController(StoreContext context, PaymentService paymentService, UserManager<User> userManager)
    {
      _context = context;
      _paymentService = paymentService;
      _userManager = userManager;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
      var user = await _userManager.FindByNameAsync(User.Identity.Name);
      var basket = await _context.Baskets.RetrieveBasketWithItems(user.Id).FirstOrDefaultAsync();
      if (basket == null) return NotFound();

      var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);
      if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

      basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
      basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;
      _context.Update(basket);

      var result = await _context.SaveChangesAsync() > 0;
      if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });

      return basket.MapBasketToDto();
    }
  }
}