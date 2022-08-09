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
  public class AccountController : BaseApiController
  {
    private readonly UserManager<User> _userManager;
    private readonly StoreContext _context;
    private readonly TokenService _tokenService;
    public AccountController(UserManager<User> userManager, StoreContext context, TokenService tokenService)
    {
      _context = context;
      _userManager = userManager;
      _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      var user = await _userManager.FindByNameAsync(loginDto.Username);

      if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) return Unauthorized();

      // - No basket, then login (user had basket or not) => Load user basket
      // - Had basket (new basket), then login (user had basket or not) => Replace user basket with new basket
      var noneBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
      if (noneBasket != null)
      {
        var userBasket = await RetrieveBasket(user.Id);
        if (userBasket != null) _context.Baskets.Remove(userBasket);

        noneBasket.BuyerId = user.Id;
        Response.Cookies.Delete("buyerId");

        await _context.SaveChangesAsync();
      }

      return new UserDto
      {
        Email = user.Email,
        Token = await _tokenService.GenerateToken(user),
        Basket = (await RetrieveBasket(user.Id)).MapBasketToDto()
      };
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
      var user = new User { UserName = registerDto.Username, Email = registerDto.Email };

      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if (!result.Succeeded)
      {
        foreach (var error in result.Errors)
        {
          ModelState.AddModelError(error.Code, error.Description);
        }

        return ValidationProblem();
      }

      await _userManager.AddToRoleAsync(user, "Member");
      return StatusCode(201);
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
      var user = await _userManager.FindByNameAsync(User.Identity.Name);

      var userBasket = await RetrieveBasket(user.Id);

      return new UserDto
      {
        Email = user.Email,
        Token = await _tokenService.GenerateToken(user),
        Basket = userBasket.MapBasketToDto()
      };
    }

    [Authorize]
    [HttpGet("saveAddress")]
    public async Task<ActionResult<UserAddress>> GetSaveAddress()
    {
      return await _userManager.Users.
                      Where(u => u.UserName == User.Identity.Name)
                      .Select(u => u.Address)
                      .FirstOrDefaultAsync();
    }

    private async Task<Basket> RetrieveBasket(string buyerId)
    {
      if (string.IsNullOrEmpty(buyerId)) return null;

      return await _context.Baskets.RetrieveBasketWithItems(buyerId).FirstOrDefaultAsync();
    }
  }
}