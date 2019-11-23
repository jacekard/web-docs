using Microsoft.EntityFrameworkCore.Migrations;

namespace WebDocs.Migrations
{
    public partial class AddLatestVersionProperty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LatestVersion",
                table: "Documents",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LatestVersion",
                table: "Documents");
        }
    }
}
