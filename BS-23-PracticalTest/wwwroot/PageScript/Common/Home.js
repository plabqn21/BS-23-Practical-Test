$(document).ready(function () {

    $.getJSON(window.rootPath + "/Home/GetDashBoarddata",
        function (data) {
           
            BindDataTochartMostSalesItem(data.MostSalesItem);
            BindDataTochartDateWiseTotalSalesAndDueAmount(data.DateWiseTotalSalesPaidDueAmountForDashBoard);
            BindDataTochartDateWiseTotalDueCollectionForDashBoard(data.DateWiseTotalDueCollectionForDashBoard);
            BindDataTochartDateWiseProfitLossForDashBoard(data.DateWiseProfitLossForDashBoard);
            BindDataTochartDateWiseExpenseForDashBoard(data.DateWiseExpenseForDashBoard);
            BindDataTochartDateWiseInhouseProductionForDashBoard(data.DateWiseInhouseProductionForDashBoard);

            BindDataTochartMostOnlineSalesItemForDashBoard(data.MostOnlineSalesItemForDashBoard);
            BindDataTochartDateWiseInstallmentCollectionForDashBoard(data.DateWiseInstallmentCollectionForDashBoard);              
            BindDataTochartDateWiseOnlineSalesPaidDueAmountForDashBoard(data.DateWiseOnlineSalesPaidDueAmountForDashBoard);
            BindDataTochartDateWiseTotalPurchasePaidDueAmountForDashBoard(data.DateWiseTotalPurchasePaidDueAmountForDashBoard);

        }).fail(function () {
            $.unblockUI();
            ErrormsgPopUp("Something Wrong.")
        });
   
 
});


function BindDataTochartMostSalesItem(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.ItemName;
    });
    var data = rczdata.map(function (e) {
        return e.SalesQuantity;
    });

    new Chart(document.getElementById("MostSalesItem"), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: "Total Sales(Qty)",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }, legend: { display: false },
            title: {
                display: true,
                text: 'Top 5 Sales Item in last 30 days(Qty)'
            }
        }
    });

}
function BindDataTochartDateWiseTotalSalesAndDueAmount(DateWiseTotalSalesPaidDueAmountForDashBoard) {
    var labels = DateWiseTotalSalesPaidDueAmountForDashBoard.map(function (e) {
        return e.SalesDate;
    });
    var TotalSalesdata = DateWiseTotalSalesPaidDueAmountForDashBoard.map(function (e) {
        return e.TotalSales;
    });
    var TotalDuedata = DateWiseTotalSalesPaidDueAmountForDashBoard.map(function (e) {
        return e.TotalDue;
    });
    var TotalPaidData = DateWiseTotalSalesPaidDueAmountForDashBoard.map(function (e) {
        return e.TotalPaid;
    });

    new Chart(document.getElementById("DateWiseTotalSalesPaidDueAmountForDashBoard"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Sales Amount",
                    backgroundColor: ["#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2"],
                    data: TotalSalesdata
                },
                {
                    label: "Paid Amount",
                    backgroundColor: ["#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f"],
                    data: TotalPaidData
                },
                {
                    label: "Due Amount",
                    backgroundColor: ["#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707"],
                    data: TotalDuedata
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: { display: false },
            title: {
                display: true,
                text: 'Sales for last 7 days'
            }
        }
    });

}
function BindDataTochartDateWiseTotalDueCollectionForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.PaymentDate;
    });
    var data = rczdata.map(function (e) {
        return e.PaidAmount;
    });

    new Chart(document.getElementById("DateWiseTotalDueCollectionForDashBoard"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Due Collection Amount",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#e8c3b9", "#c45850"],
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }, legend: { display: false },
            title: {
                display: true,
                text: 'Due collection for last 7 days'
            },
            hover: {
                animationDuration: 1
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            }
        }
    });

}
function BindDataTochartDateWiseProfitLossForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.SalesDate;
    });
    var data = rczdata.map(function (e) {
        return e.ProfitLoss;
    });

    new Chart(document.getElementById("DateWiseProfitLossForDashBoard"), {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: "Profit/Loss",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#3cba9f"],               
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }, legend: { display: false },
            title: {
                display: true,
                text: 'Profit/Loss for last 7 days'
            },
            hover: {
                animationDuration: 1
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            }
        }
    });

}
function BindDataTochartDateWiseExpenseForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.EntryDate;
    });
    var data = rczdata.map(function (e) {
        return e.TotalExpense;
    });

    new Chart(document.getElementById("DateWiseExpenseForDashBoard"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Expense",
                borderColor: "#3cba9f",
                fill: false,
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }, legend: { display: false },
            title: {
                display: true,
                text: 'Expense for last 7 days'
            },
            hover: {
                animationDuration: 1
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            }
        }
    });

}
function BindDataTochartDateWiseInhouseProductionForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.ProductionEndDate;
    });
    var data = rczdata.map(function (e) {
        return e.ProductionQty;
    });

    new Chart(document.getElementById("DateWiseInhouseProductionForDashBoard"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Quantity",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#e8c3b9", "#8e5ea2", "#3cba9f"],               
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }, legend: { display: false },
            title: {
                display: true,
                text: 'Inhouse production for last 7 days'
            },
            hover: {
                animationDuration: 1
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            }
        }
    });

}
function BindDataTochartMostOnlineSalesItemForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.ItemName;
    });
    var data = rczdata.map(function (e) {
        return e.SalesQuantity;
    });

    new Chart(document.getElementById("MostOnlineSalesItemForDashBoard"), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: "Total Sales(Qty)",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }, legend: { display: false },
            title: {
                display: true,
                text: 'Top 5 Online Sales Item in last 30 days(Qty)'
            }
        }
    });

}
function BindDataTochartDateWiseInstallmentCollectionForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.PaymentDate;
    });
    var data = rczdata.map(function (e) {
        return e.PaidAmount;
    });
    new Chart(document.getElementById("DateWiseInstallmentCollectionForDashBoard"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Amount",
                borderColor: "#3e95cd",
                fill: false,
                data: data
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }, legend: { display: false },
            title: {
                display: true,
                text: 'Installment collection for last 7 days'
            },
            hover: {
                animationDuration: 1
            },
            animation: {
                duration: 1,
                onComplete: function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);

                        });
                    });
                }
            }
        }
    });
    

}
function BindDataTochartDateWiseOnlineSalesPaidDueAmountForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.SalesDate;
    });
    var TotalSalesdata = rczdata.map(function (e) {
        return e.TotalSales;
    });
    var TotalDuedata = rczdata.map(function (e) {
        return e.TotalDue;
    });
    var TotalPaidData = rczdata.map(function (e) {
        return e.TotalPaid;
    });

    new Chart(document.getElementById("DateWiseOnlineSalesPaidDueAmountForDashBoard"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Sales Amount",
                    backgroundColor: ["#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f", "#3cba9f"] ,
                    data: TotalSalesdata
                },
                {
                    label: "Paid Amount",
                    backgroundColor: ["#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2", "#8e5ea2"] ,
                    data: TotalPaidData
                },
                {
                    label: "Due Amount",
                    backgroundColor: ["#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707"],
                    data: TotalDuedata
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: { display: false },
            title: {
                display: true,
                text: 'Online Sales for last 7 days'
            }
        }
    });

}
function BindDataTochartDateWiseTotalPurchasePaidDueAmountForDashBoard(rczdata) {
    var labels = rczdata.map(function (e) {
        return e.PurchaseDate;
    });
    var TotalSalesdata = rczdata.map(function (e) {
        return e.TotalPurchase;
    });
    var TotalDuedata = rczdata.map(function (e) {
        return e.TotalDue;
    });
    var TotalPaidData = rczdata.map(function (e) {
        return e.TotalPaid;
    });

    new Chart(document.getElementById("DateWiseTotalPurchasePaidDueAmountForDashBoard"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Purchase Amount",
                    backgroundColor: ["#c45850", "#c45850", "#c45850", "#c45850", "#c45850", "#c45850", "#c45850"],
                    data: TotalSalesdata
                },
                {
                    label: "Paid Amount",
                    backgroundColor: ["#e8c3b9", "#e8c3b9", "#e8c3b9", "#e8c3b9", "#e8c3b9", "#e8c3b9", "#e8c3b9"],
                    data: TotalPaidData
                },
                {
                    label: "Due Amount",
                    backgroundColor: ["#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707", "#ad0707"],
                    data: TotalDuedata
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: { display: false },
            title: {
                display: true,
                text: 'Purchase for last 7 days'
            }
        }
    });

}