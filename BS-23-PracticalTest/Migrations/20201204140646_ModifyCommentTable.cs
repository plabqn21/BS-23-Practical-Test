using Microsoft.EntityFrameworkCore.Migrations;

namespace BS_23_PracticalTest.Migrations
{
    public partial class ModifyCommentTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CommentNo",
                table: "PostComment",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentNo",
                table: "PostComment");
        }
    }
}
