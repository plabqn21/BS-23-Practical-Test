using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BS_23_PracticalTest.Migrations
{
    public partial class AddCommentTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PostComment",
                columns: table => new
                {
                    Id = table.Column<string>(type: "VARCHAR(42)", nullable: false),
                    CommentDetails = table.Column<string>(type: "VARCHAR(Max)", nullable: false),
                    MasterPostId = table.Column<string>(type: "VARCHAR(42)", nullable: true),
                    ApplicationUserId = table.Column<string>(type: "NVARCHAR(450)", nullable: true),
                    DateAdded = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Like = table.Column<int>(type: "int", nullable: false),
                    DisLike = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostComment_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostComment_MasterPost_MasterPostId",
                        column: x => x.MasterPostId,
                        principalTable: "MasterPost",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PostComment_ApplicationUserId",
                table: "PostComment",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostComment_MasterPostId",
                table: "PostComment",
                column: "MasterPostId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostComment");
        }
    }
}
