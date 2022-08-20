## Init .NET API Project
```
dotnet new sln
dotnet new webapi -o API
dotnet sln add API
dotnet new gitignore
```
## Integrate Entity Framework
1. Install packages
```
cd API
dotnet tool install --global dotnet-ef

dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

2. Connect DB to App
- Create DbContext (StoreContext.cs)
- Get ConnectionStrings, add it to appsettings.json & inject it to Startup.cs
- Create Products table: Create Product Model & add it to DbContext

3. Migrations
```
dotnet ef migrations add InitialCreate -o Data/Migrations
dotnet ef database update
Ctrl + P, > SQLite: Open database
```

4. Auto create table from Migrations & Seed database
```
dotnet ef database drop
dotnet watch run
```

## Init React
```
npx create-react-app client --template typescript --use-npm
```
File structure: Grouping by features https://reactjs.org/docs/faq-structure.html

## Integrate Identity Framework
1. Install packages
```
cd API
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```
2. Init data and register services in Startup.cs
- Create roles
- Create users

3. Migrations and auto create Identity tables with Init data
```
dotnet ef migrations add IdentityAdded
dotnet watch run
```

## Integrate Stripe & payment flow
1. When user click Checkout => call API to create or update Payment Intent
- BE save payment intent id & client secret
- Check https://dashboard.stripe.com/ => created a payment (incomplete status)
2. When user input card info & click pay => call stripe.confirmCardPayment(clientSecret)
=> return resultPayment => if succeeded, call API to create Order

* Although created Order, but it's status is still Pending. For secure, we shouldn't trust user. We need a confirmation from Stripe to BE, then BE will update the order's status to ReceivedPayment.
* How to implement this process? => using webhook
3. Implement Webhook
- Install Stripe CLI for server
- Run `stripe listen` to get `WhSecret` from Stripe
- Create webhook API to receive event from Stripe by `WhSecret`
- Run cmd: `stripe listen -f http://localhost:5000/api/payments/webhook -e payment_intent.succeeded`