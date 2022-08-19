using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
  public class Basket
  {
    public int Id { get; set; }
    public string BuyerId { get; set; }

    public List<BasketItem> Items { get; set; } = new();
    public string PaymentIntentId { get; set; }
    public string ClientSecret { get; set; }

    public void AddItem(Product product, int quantity)
    {
      var item = Items.FirstOrDefault(item => item.ProductId == product.Id);
      if (item == null)
      {
        Items.Add(new BasketItem { Quantity = quantity, Product = product });
      }
      else
      {
        item.Quantity += quantity;
      }
    }

    public void RemoveItem(int productId, int quantity)
    {
      var item = Items.FirstOrDefault(item => item.ProductId == productId);
      if (item == null) return;
      item.Quantity -= quantity;
      if (item.Quantity <= 0) Items.Remove(item);
    }
  }
}