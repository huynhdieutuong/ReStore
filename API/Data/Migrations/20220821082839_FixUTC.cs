using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    public partial class FixUTC : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "91c4f465-3ac8-43bc-a026-06781c3d382a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c61107de-2ed4-48d8-84ea-6ea35fe9822b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "cac65665-f182-4941-8310-c6961cfbef6f", "39f0cc76-2873-4dec-9c99-757bce520ff9", "Admin", "ADMIN" },
                    { "ffafbc3c-ccba-44c0-a2c5-5038581b5ac4", "ca010c49-ed63-4eed-965a-224a1e2fd0fa", "Member", "MEMBER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cac65665-f182-4941-8310-c6961cfbef6f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ffafbc3c-ccba-44c0-a2c5-5038581b5ac4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "91c4f465-3ac8-43bc-a026-06781c3d382a", "19937733-4f34-48fd-8f91-e3086475b6c2", "Member", "MEMBER" },
                    { "c61107de-2ed4-48d8-84ea-6ea35fe9822b", "33dd39cb-0a62-465b-af23-19d5152a049d", "Admin", "ADMIN" }
                });
        }
    }
}
