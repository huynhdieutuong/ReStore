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