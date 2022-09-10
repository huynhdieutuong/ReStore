using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    public partial class PublicIdAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cac65665-f182-4941-8310-c6961cfbef6f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ffafbc3c-ccba-44c0-a2c5-5038581b5ac4");

            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "65a2c133-c155-46ac-af12-efffcb07bb48", "a31cc513-0347-4072-b585-9b8ff98381b5", "Admin", "ADMIN" },
                    { "cbfb3244-9a52-4cc2-9f96-0fdedab2d099", "529d6457-9176-473d-8d88-c27f7e394149", "Member", "MEMBER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "65a2c133-c155-46ac-af12-efffcb07bb48");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cbfb3244-9a52-4cc2-9f96-0fdedab2d099");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Products");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "cac65665-f182-4941-8310-c6961cfbef6f", "39f0cc76-2873-4dec-9c99-757bce520ff9", "Admin", "ADMIN" },
                    { "ffafbc3c-ccba-44c0-a2c5-5038581b5ac4", "ca010c49-ed63-4eed-965a-224a1e2fd0fa", "Member", "MEMBER" }
                });
        }
    }
}
