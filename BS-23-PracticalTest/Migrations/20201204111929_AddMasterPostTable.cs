using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BS_23_PracticalTest.Migrations
{
    public partial class AddMasterPostTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CustomRoleId",
                table: "AspNetUsers",
                type: "NVARCHAR(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(32)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "MasterPost",
                columns: table => new
                {
                    Id = table.Column<string>(type: "VARCHAR(42)", nullable: false),
                    PostDetails = table.Column<string>(type: "VARCHAR(Max)", nullable: false),
                    ApplicationUserId = table.Column<string>(type: "NVARCHAR(450)", nullable: true),
                    DateAdded = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PostNo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterPost", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MasterPost_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MasterPost_ApplicationUserId",
                table: "MasterPost",
                column: "ApplicationUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MasterPost");

            migrationBuilder.AlterColumn<string>(
                name: "CustomRoleId",
                table: "AspNetUsers",
                type: "NVARCHAR(32)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(450)",
                oldNullable: true);
        }
    }
}
