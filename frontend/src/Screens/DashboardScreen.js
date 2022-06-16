import { getSummary } from "../Api/apiSummary.js";
import DashboardMenu from "../components/dashboardMenu.js";
import Chartist from "chartist";

let summary = {};
const DashboardScreen = {
    after_render: () => {
        new Chartist.Line('.ct-chart', 
            {
                labels: summary.dailyOrders.map((x) => x._id),
                series: [summary.dailyOrders.map((x) => x.sales)],
            },
            {
                showArea: true
            }
        );
        new Chartist.Pie('.ct-chart-pie',
            {
                labels: summary.productCategories.map((x) => x._id),
                series: summary.productCategories.map((x) => x.count),
            },
            {
                donut: true,
                donutWidth: 60,
                startAngle: 270,
                showLabel: true,
                donutSolid: true
            }
        );
    },
    render: async () => {
        summary = await getSummary();
        return `
        <div class="dashboard content">
            ${DashboardMenu.render({selected: 'dashboard'})}
            <div class="dashboard-content">
                <div class="dp-list-header">    
                    <h1>Overview</h1>
                </div>
                <div class="summary">
                    <div class="summary-items">
                        <div class="summary-title color-1">
                            <i class="fa fa-users"></i>
                            <h2>Users</h2>
                        </div>
                        <div class="summary-body">${summary.users[0].numUsers}</div>
                    </div>
                    <div class="summary-items">
                        <div class="summary-title color-2">
                            <i class="fa fa-shopping-cart"></i>
                            <h2>Orders</h2>
                        </div>
                        <div class="summary-body">${summary.orders[0].numOrders}</div>
                    </div>
                    <div class="summary-items">
                        <div class="summary-title color-3">
                            <i class="fa fa-money"></i>
                            <h2>Sales</h2>
                        </div>
                        <div class="summary-body">$${summary.orders[0].totalSales}</div>
                    </div>
                </div>
                <div class="charts">
                    <div>
                        <div class="charts-header"><h2>Sales</h2></div>
                        <div class="ct-perfect-fourth ct-chart"></div>
                    </div>
                    <div class="charts-categories">
                        <div class="charts-header"><h2>Categories</h2></div>
                        <div class="ct-perfect-fourth ct-chart-pie"></div>
                    </div>
                </div>
            </div>
        </div>
        `
    },
};

export default DashboardScreen;