// ------------ Q1--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 200, bottom: 50, left: 250 },
        width = 700,
        height = 520;

    const data1 = window.data.map(d => ({
        "Nhóm hàng": `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`,
        "Mặt hàng": `[${d["Mã mặt hàng"]}] ${d["Tên mặt hàng"]}`,
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0
    }));

    const dataq1 = data1.reduce((acc, item) => {
        const existingItem = acc.find(d => d["Mặt hàng"] === item["Mặt hàng"]);
        if (existingItem) {
            existingItem["Thành tiền"] += item["Thành tiền"];
            existingItem["SL"] += item["SL"];
        } else {
            acc.push({
                "Mặt hàng": item["Mặt hàng"],
                "Nhóm hàng": item["Nhóm hàng"],
                "Thành tiền": item["Thành tiền"],
                "SL": item["SL"]
            });
        }
        return acc;
    }, []);

    dataq1.sort((a, b) => b["Thành tiền"] - a["Thành tiền"]);

    const svg = d3.select("#Q1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, 700_000_000])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(dataq1.map(d => d["Mặt hàng"]))
        .range([0, height])
        .padding(0.2);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const bars = chart.selectAll(".bar")
        .data(dataq1)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("y", d => y(d["Mặt hàng"]))
        .attr("width", d => x(d["Thành tiền"]))
        .attr("height", y.bandwidth())
        .attr("fill", d => colorScale(d["Nhóm hàng"]))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <strong>Mặt hàng:</strong> ${d["Mặt hàng"]}<br>
                <strong>Nhóm hàng:</strong> ${d["Nhóm hàng"]}<br>
                <strong>Doanh số bán:</strong> ${(d["Thành tiền"] / 1_000_000).toFixed(0)} triệu VND<br>
                <strong>Số lượng bán:</strong> ${d["SL"]} SKUs
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3);
                d3.select(this).attr("opacity", 1);
            } else {
                bars.attr("opacity", 1);
            }
        });

    chart.selectAll(".label")
        .data(dataq1)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d["Thành tiền"]) + 5)
        .attr("y", d => y(d["Mặt hàng"]) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => `${(d["Thành tiền"] / 1_000_000).toFixed(0)} triệu VNĐ`)
        .style("font-size", "14px");

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickFormat(d => `${(d / 1_000_000).toFixed(0)}M`)
            .ticks(7)
        )
        .style("font-size", "14px");

    chart.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "14px")
        .style("text-anchor", "end");

    const filter = svg.append("g")
        .attr("transform", `translate(${width + margin.left + 30},${margin.top})`);

    const filterRects = filter.selectAll("rect")
        .data(colorScale.domain())
        .enter()
        .append("rect")
        .attr("y", (d, i) => i * 25)
        .attr("width", 20)
        .attr("height", 20)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", colorScale)
        .on("click", function (event, selectedGroup) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3);
                bars.filter(d => d["Nhóm hàng"] === selectedGroup).attr("opacity", 1);
            } else {
                bars.attr("opacity", 1);
            }
        });

    filter.selectAll("text")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 25 + 14)
        .text(d => d)
        .style("font-size", "14px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left");
});

// ------------ Q2--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    const data2 = window.data.map(d => ({
        "Nhóm hàng": `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`,
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0
    }));

    const tonghop = d3.rollups(
        data2,
        v => ({
            doanhThu: d3.sum(v, d => d["Thành tiền"]),
            soLuong: d3.sum(v, d => d["SL"])
        }),
        d => d["Nhóm hàng"]
    );

    const dataq2 = tonghop.map(([nhomHang, data]) => ({
        "Nhóm hàng": nhomHang,
        "Doanh thu": data.doanhThu,
        "Số lượng": data.soLuong
    }));

    dataq2.sort((a, b) => b["Doanh thu"] - a["Doanh thu"]);

    const margin = { top: 40, right: 100, bottom: 50, left: 200 },
          width = 1000,
          height = 400;

    const svg = d3.select("#Q2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(dataq2, d => d["Doanh thu"]) / 1_000_000])
        .range([0, width])
        .nice();

    const y = d3.scaleBand()
        .domain(dataq2.map(d => d["Nhóm hàng"]))
        .range([0, height])
        .padding(0.2);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(dataq2.map(d => d["Nhóm hàng"]));

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left")
        .style("font-size", "12px");

    const formatNumber = d => Math.round(d).toLocaleString("en-US"); 

    let selectedBar = null;

    const bars = chart.selectAll(".bar")
        .data(dataq2)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d["Nhóm hàng"]))
        .attr("width", d => x(d["Doanh thu"] / 1_000_000))
        .attr("height", y.bandwidth())
        .attr("fill", d => colorScale(d["Nhóm hàng"]))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`
                <strong>Nhóm hàng:</strong> ${d["Nhóm hàng"]}<br>
                <strong>Doanh số bán:</strong> ${formatNumber(d["Doanh thu"] / 1_000_000)} triệu VNĐ<br>
                <strong>Số lượng bán:</strong> ${formatNumber(d["Số lượng"])} SKUs
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    bars.on("click", function (event, d) {
        if (d3.select(this).attr("opacity") !== "0.3") {
            bars.attr("opacity", 0.3); 
            d3.select(this).attr("opacity", 1)
        } else {
            bars.attr("opacity", 1);
        }
    });

    chart.selectAll(".label")
        .data(dataq2)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d["Doanh thu"] / 1_000_000) + 5) 
        .attr("y", d => y(d["Nhóm hàng"]) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .text(d => `${formatNumber(d["Doanh thu"] / 1_000_000)} triệu VNĐ`);

    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .tickFormat(d => `${d}M`) 
            .ticks(7)
        )
        .style("font-size", "14px");

    chart.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "14px")
        .style("text-anchor", "end");
});

// ------------ Q3--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 40, bottom: 50, left: 50 },
        width = 1100,
        height = 400;

    const data3 = window.data.map(d => ({
        "Thời gian tạo đơn": d["Thời gian tạo đơn"],
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0
    }));

    const monthdata = data3.map(d => ({
        "Tháng": new Date(d["Thời gian tạo đơn"]).toLocaleString('default', { month: '2-digit' }),
        "Thành tiền": d["Thành tiền"],
        "SL": d["SL"]
    }));

    const dataq3 = monthdata.reduce((acc, item) => {
        const existingItem = acc.find(d => d["Tháng"] === item["Tháng"]);
        if (existingItem) {
            existingItem["Thành tiền"] += item["Thành tiền"];
            existingItem["SL"] += item["SL"];
        } else {
            acc.push({
                "Tháng": item["Tháng"],
                "Thành tiền": item["Thành tiền"],
                "SL": item["SL"]
            });
        }
        return acc;
    }, []);

    dataq3.sort((a, b) => a["Tháng"] - b["Tháng"]);

    const svg = d3.select("#Q3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(dataq3.map(d => `Tháng ${d["Tháng"]}`)) 
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 800_000_000]) 
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const bars = chart.selectAll(".bar")
        .data(dataq3)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", d => x(`Tháng ${d["Tháng"]}`))
        .attr("y", d => y(d["Thành tiền"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Thành tiền"]))
        .attr("fill", d => colorScale(d["Tháng"]))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <p><strong>Tháng ${d["Tháng"].padStart(2, '0')}</strong></p>
                <p><strong>Doanh số bán:</strong> ${(d["Thành tiền"] / 1_000_000).toFixed(0)} triệu VND</p>
                <p><strong>Số lượng bán:</strong> ${d["SL"]} SKUs</p>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3); 
                d3.select(this).attr("opacity", 1); 
            } else {
                bars.attr("opacity", 1); 
            }
        });

    chart.selectAll(".label")
        .data(dataq3)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(`Tháng ${d["Tháng"]}`) + x.bandwidth() / 2)
        .attr("y", d => y(d["Thành tiền"]) - 5)
        .attr("text-anchor", "middle")
        .text(d => `${(d["Thành tiền"] / 1_000_000).toFixed(0)} triệu VNĐ`)
        .style("font-size", "14px");

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "14px");

    chart.append("g")
        .call(d3.axisLeft(y)
            .tickFormat(d => `${(d / 1_000_000).toFixed(0)}M`) 
            .ticks(8)
        )
        .style("font-size", "14px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left");
});

// ------------ Q4--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 40, bottom: 50, left: 50 },
        width = 900,
        height = 400;

    const data4 = window.data.map(d => ({
        "Thời gian tạo đơn": new Date(d["Thời gian tạo đơn"]),
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0
    }));

    const getWeekday = (date) => {
        const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        return weekdays[date.getDay()];
    };

    const daydata = data4.map(d => ({
        "Ngày tạo đơn": d["Thời gian tạo đơn"].toISOString().split('T')[0],
        "Thứ": getWeekday(d["Thời gian tạo đơn"]),
        "Thành tiền": d["Thành tiền"],
        "SL": d["SL"]
    }));

    const dataq4 = daydata.reduce((acc, item) => {
        const existingItem = acc.find(d => d["Thứ"] === item["Thứ"]);
        if (existingItem) {
            existingItem["Thành tiền"] += item["Thành tiền"];
            existingItem["SL"] += item["SL"];
            existingItem["Ngày tạo đơn"].push(item["Ngày tạo đơn"]);
        } else {
            acc.push({
                "Thứ": item["Thứ"],
                "Thành tiền": item["Thành tiền"],
                "SL": item["SL"],
                "Ngày tạo đơn": [item["Ngày tạo đơn"]]
            });
        }
        return acc;
    }, []);

    dataq4.forEach(d => {
        const uniqueDays = [...new Set(d["Ngày tạo đơn"])].length;
        d["Doanh số bán TB"] = d["Thành tiền"] / uniqueDays;
        d["Số lượng bán TB"] = d["SL"] / uniqueDays;
    });

    const weekdaysOrder = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
    dataq4.sort((a, b) => weekdaysOrder.indexOf(a["Thứ"]) - weekdaysOrder.indexOf(b["Thứ"]));

    const svg = d3.select("#Q4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(dataq4.map(d => d["Thứ"]))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 15_000_000])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const bars = chart.selectAll(".bar")
        .data(dataq4)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", d => x(d["Thứ"]))
        .attr("y", d => y(d["Doanh số bán TB"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Doanh số bán TB"]))
        .attr("fill", d => colorScale(d["Thứ"]))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(
                `<p><strong>Ngày ${d["Thứ"]}</strong></p>
                <p><strong>Doanh số bán TB:</strong> ${Math.round(d["Doanh số bán TB"]).toLocaleString()} VND</p>
                <p><strong>Số lượng bán TB:</strong> ${Math.round(d["Số lượng bán TB"]).toLocaleString()} SKUs</p>`
            )
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3);
                d3.select(this).attr("opacity", 1);
            } else {
                bars.attr("opacity", 1);
            }
        });

    chart.selectAll(".label")
        .data(dataq4)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d["Thứ"]) + x.bandwidth() / 2)
        .attr("y", d => y(d["Doanh số bán TB"]) - 5)
        .attr("text-anchor", "middle")
        .text(d => `${Math.round(d["Doanh số bán TB"]).toLocaleString()} VND`)
        .style("font-size", "14px");

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "14px");

    chart.append("g")
        .call(d3.axisLeft(y)
            .tickFormat(d => `${(d / 1_000_000).toFixed(0)}M`)
            .ticks(15)
        )
        .style("font-size", "14px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left");
});

// ------------ Q5--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 40, bottom: 50, left: 50 },
        width = 1200,
        height = 400;

    const data5 = window.data.map(d => ({
        "Thời gian tạo đơn": new Date(d["Thời gian tạo đơn"]),
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0
    }));

    const daydata = data5.map(d => ({
        "Ngày tạo đơn": d["Thời gian tạo đơn"].toISOString().split('T')[0],
        "Ngày trong tháng": `Ngày ${d["Thời gian tạo đơn"].getDate().toString().padStart(2, '0')}`,
        "Thành tiền": d["Thành tiền"],
        "SL": d["SL"]
    }));

    const dataq5 = daydata.reduce((acc, item) => {
        const existingItem = acc.find(d => d["Ngày trong tháng"] === item["Ngày trong tháng"]);
        if (existingItem) {
            existingItem["Thành tiền"] += item["Thành tiền"];
            existingItem["SL"] += item["SL"];
            existingItem["Ngày tạo đơn"].push(item["Ngày tạo đơn"]);
        } else {
            acc.push({
                "Ngày trong tháng": item["Ngày trong tháng"],
                "Thành tiền": item["Thành tiền"],
                "SL": item["SL"],
                "Ngày tạo đơn": [item["Ngày tạo đơn"]]
            });
        }
        return acc;
    }, []);

    dataq5.forEach(d => {
        const uniqueDays = [...new Set(d["Ngày tạo đơn"])].length;
        d["Doanh số bán TB"] = d["Thành tiền"] / uniqueDays;
        d["Số lượng bán TB"] = d["SL"] / uniqueDays;
    });

    dataq5.sort((a, b) => parseInt(a["Ngày trong tháng"].split(' ')[1]) - parseInt(b["Ngày trong tháng"].split(' ')[1]));

    const svg = d3.select("#Q5")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(dataq5.map(d => d["Ngày trong tháng"]))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 15_000_000])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const bars = chart.selectAll(".bar")
        .data(dataq5)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", d => x(d["Ngày trong tháng"]))
        .attr("y", d => y(d["Doanh số bán TB"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Doanh số bán TB"]))
        .attr("fill", d => colorScale(d["Ngày trong tháng"]))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <p><strong>${d["Ngày trong tháng"]}</strong></p>
                <p><strong>Doanh số bán TB:</strong> ${(d["Doanh số bán TB"] / 1_000_000).toFixed(1)} triệu VND</p>
                <p><strong>Số lượng bán TB:</strong> ${d["Số lượng bán TB"].toFixed(0)} SKUs</p>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3);
                d3.select(this).attr("opacity", 1);
            } else {
                bars.attr("opacity", 1);
            }
        });

    chart.selectAll(".label")
        .data(dataq5)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d["Ngày trong tháng"]) + x.bandwidth() / 2)
        .attr("y", d => y(d["Doanh số bán TB"]) - 5)
        .attr("text-anchor", "middle")
        .text(d => `${(d["Doanh số bán TB"] / 1_000_000).toFixed(1)} tr`)
        .style("font-size", "12px");

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "14px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-45)");

    chart.append("g")
        .call(d3.axisLeft(y)
            .tickFormat(d => `${(d / 1_000_000).toFixed(0)}M`)
            .ticks(15)
        )
        .style("font-size", "14px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left");
});

// ------------ Q6--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 40, bottom: 100, left: 50 },
        width = 1100,
        height = 350;

    const data6 = window.data.map(d => ({
        "Thời gian tạo đơn": new Date(d["Thời gian tạo đơn"]),
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0
    }));

    const hourdata = data6.map(d => ({
        "Khung giờ": `${d["Thời gian tạo đơn"].getHours().toString().padStart(2, '0')}:00-${d["Thời gian tạo đơn"].getHours().toString().padStart(2, '0')}:59`,
        "Ngày tạo đơn": d["Thời gian tạo đơn"].toISOString().split('T')[0],
        "Thành tiền": d["Thành tiền"],
        "SL": d["SL"]
    }));

    const dataq6 = hourdata.reduce((acc, item) => {
        const existingItem = acc.find(d => d["Khung giờ"] === item["Khung giờ"]);
        if (existingItem) {
            existingItem["Thành tiền"] += item["Thành tiền"];
            existingItem["SL"] += item["SL"];
            existingItem["Ngày tạo đơn"].push(item["Ngày tạo đơn"]);
        } else {
            acc.push({
                "Khung giờ": item["Khung giờ"],
                "Thành tiền": item["Thành tiền"],
                "SL": item["SL"],
                "Ngày tạo đơn": [item["Ngày tạo đơn"]]
            });
        }
        return acc;
    }, []);

    dataq6.forEach(d => {
        const uniqueDays = [...new Set(d["Ngày tạo đơn"])].length;
        d["Doanh số bán TB"] = Math.ceil(d["Thành tiền"] / uniqueDays);
        d["Số lượng bán TB"] = d["SL"];
    });

    dataq6.sort((a, b) => parseInt(a["Khung giờ"].split(':')[0]) - parseInt(b["Khung giờ"].split(':')[0]));

    const svg = d3.select("#Q6")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(dataq6.map(d => d["Khung giờ"]))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 900_000])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const bars = chart.selectAll(".bar")
        .data(dataq6)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", d => x(d["Khung giờ"]))
        .attr("y", d => y(d["Doanh số bán TB"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Doanh số bán TB"]))
        .attr("fill", d => colorScale(d["Khung giờ"]))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(
                `<p><strong>Khung giờ: ${d["Khung giờ"]}</strong></p>
                <p><strong>Doanh số bán TB:</strong> ${Math.round(d["Doanh số bán TB"]).toLocaleString()} VND</p>
                <p><strong>Số lượng bán TB:</strong> ${Math.round(d["Số lượng bán TB"]).toLocaleString()} SKUs</p>`
            )
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3);
                d3.select(this).attr("opacity", 1);
            } else {
                bars.attr("opacity", 1);
            }
        });

    chart.selectAll(".label")
        .data(dataq6)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d["Khung giờ"]) + x.bandwidth() / 2)
        .attr("y", d => y(d["Doanh số bán TB"]) - 5)
        .attr("text-anchor", "middle")
        .text(d => `${Math.round(d["Doanh số bán TB"]).toLocaleString()} VND`)
        .style("font-size", "10px");

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "10px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-45)");

    chart.append("g")
        .call(d3.axisLeft(y)
            .tickFormat(d => `${(d / 1_000).toFixed(0)}K`)
            .ticks(9)
        )
        .style("font-size", "14px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left");
});

// ------------ Q7--------------//
document.addEventListener("DOMContentLoaded", function () {
    // Chờ dữ liệu được load từ `data.js`
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }


    console.log("Dữ liệu đã load:", window.data);


    // Định nghĩa kích thước
    const margin = { top: 40, right: 40, bottom: 50, left: 200 }, // Tăng margin.left để tránh chồng chữ
        width = 900,
        height = 450;


    // Chuyển đổi dữ liệu
    const data7 = window.data.map(d => ({
        "Mã đơn hàng": d["Mã đơn hàng"],
        "Nhóm hàng": `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`,
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0
    }));


    // Tính xác suất bán và số lượng bán trung bình
    const totalorders = [...new Set(data7.map(d => d["Mã đơn hàng"]))].length; // Tổng số đơn hàng duy nhất
    const dataq7 = data7.reduce((acc, item) => {
        const existingItem = acc.find(d => d["Nhóm hàng"] === item["Nhóm hàng"]);
        if (existingItem) {
            existingItem["Thành tiền"] += item["Thành tiền"];
            existingItem["SL"] += item["SL"];
            existingItem["Mã đơn hàng"].push(item["Mã đơn hàng"]);
        } else {
            acc.push({
                "Nhóm hàng": item["Nhóm hàng"],
                "Thành tiền": item["Thành tiền"],
                "SL": item["SL"],
                "Mã đơn hàng": [item["Mã đơn hàng"]]
            });
        }
        return acc;
    }, []);


    // Tính xác suất bán và số lượng bán trung bình
    dataq7.forEach(d => {
        const uniqueorders = [...new Set(d["Mã đơn hàng"])].length; // COUNTD(Mã đơn hàng)
        d["Xác suất bán"] = (uniqueorders / totalorders) * 100; // Xác suất bán (%)
        d["SL Đơn Bán"] = uniqueorders; // Số lượng đơn bán
    });


    // Sắp xếp dữ liệu theo Xác suất bán giảm dần
    dataq7.sort((a, b) => b["Xác suất bán"] - a["Xác suất bán"]);


    // Tạo SVG
    const svg = d3.select("#Q7")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Thang đo
    const x = d3.scaleLinear()
        .domain([0, 60]) // Giới hạn trục x từ 0% đến 60%
        .range([0, width]);


    const y = d3.scaleBand()
        .domain(dataq7.map(d => d["Nhóm hàng"]).reverse()) // Trục y là các nhóm hàng
        .range([height, 0])
        .padding(0.2);


    // Tạo màu sắc cho các nhóm hàng
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


    // Vẽ cột
    const bars = chart.selectAll(".bar")
        .data(dataq7)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d["Nhóm hàng"]))
        .attr("width", d => x(d["Xác suất bán"]))
        .attr("height", y.bandwidth())
        .attr("fill", d => colorScale(d["Nhóm hàng"])) // Màu sắc theo nhóm hàng
        .on("mouseover", function (event, d) {
            // Hiển thị tooltip khi di chuột vào thanh
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <p><strong>Nhóm hàng: ${d["Nhóm hàng"]}</strong></p>
                <p><strong>SL Đơn Bán:</strong> ${d["SL Đơn Bán"].toLocaleString()}</p>
                <p><strong>Xác suất Bán:</strong> ${d["Xác suất bán"].toFixed(1)}%</p>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            // Ẩn tooltip khi di chuột ra khỏi thanh
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            // Nhấp chuột một lần: làm nhạt các thanh khác
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3); // Làm nhạt tất cả các thanh
                d3.select(this).attr("opacity", 1); // Giữ nguyên màu của thanh được chọn
            } else {
                // Nhấp chuột hai lần: trở về trạng thái ban đầu
                bars.attr("opacity", 1); // Khôi phục màu sắc ban đầu
            }
        });


    // Nhãn số liệu trên cột
    chart.selectAll(".label")
        .data(dataq7)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d["Xác suất bán"]) + 5) // Đặt nhãn bên phải thanh
        .attr("y", d => y(d["Nhóm hàng"]) + y.bandwidth() / 2)
        .attr("dy", "0.35em") // Căn giữa theo chiều dọc
        .text(d => `${d["Xác suất bán"].toFixed(1)}%`) // Hiển thị giá trị xác suất bán
        .style("font-size", "14px");


    // Trục X
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickFormat(d => `${d}%`) // Định dạng trục x với đơn vị %
            .ticks(6) // Số lượng tick (bước nhảy 10%)
        )
        .style("font-size", "14px");


    // Trục Y
    chart.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "14px");


    // Tạo tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left"); // Căn trái nội dung tooltip
});

// ------------ Q8--------------//
document.addEventListener("DOMContentLoaded", function () {
    // Chờ dữ liệu được load từ `data.js`
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 200, bottom: 100, left: 200 },
        width = 900, height = 400;

    const data8 = window.data.map(d => ({
        "Mã đơn hàng": d["Mã đơn hàng"],
        "Nhóm hàng": `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`,
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0,
        "Tháng tạo đơn": `Tháng ${new Date(d["Thời gian tạo đơn"]).toLocaleString('default', { month: '2-digit' })}` // Tách tháng từ cột Thời gian tạo đơn
    }));

    const totalordersmonth = data8.reduce((acc, item) => {
        const month = item["Tháng tạo đơn"];
        if (!acc[month]) {
            acc[month] = new Set();
        }
        acc[month].add(item["Mã đơn hàng"]);
        return acc;
    }, {});

    const dataq8 = data8.reduce((acc, item) => {
        const month = item["Tháng tạo đơn"];
        const group = item["Nhóm hàng"];
        const key = `${month}|${group}`;

        if (!acc[key]) {
            acc[key] = {
                "Tháng": month,
                "Nhóm hàng": group,
                "Mã đơn hàng": new Set(),
                "SL": 0
            };
        }
        acc[key]["Mã đơn hàng"].add(item["Mã đơn hàng"]);
        acc[key]["SL"] += item["SL"];
        return acc;
    }, {});

    const finalData = Object.values(dataq8).map(d => {
        const uniqueorders = d["Mã đơn hàng"].size;
        const totalorders = totalordersmonth[d["Tháng"]].size;
        d["Xác suất bán"] = (uniqueorders / totalorders) * 100;
        d["SL Đơn Bán"] = uniqueorders;
        return d;
    });

    const svg = d3.select("#Q8")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const x = d3.scaleBand()
        .domain(["Tháng 01", "Tháng 02", "Tháng 03", "Tháng 04", "Tháng 05", "Tháng 06", "Tháng 07", "Tháng 08", "Tháng 09", "Tháng 10", "Tháng 11", "Tháng 12"])
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([20, 70]) 
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const groupedData = d3.groups(finalData, d => d["Nhóm hàng"]);

    const line = d3.line()
        .x(d => x(d["Tháng"]) + x.bandwidth() / 2)
        .y(d => y(d["Xác suất bán"]));


    const lines = chart.selectAll(".line")
        .data(groupedData)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", d => line(d[1]))
        .attr("stroke", d => colorScale(d[0]))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <p><strong>Nhóm hàng: ${d[0]}</strong></p>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            const isActive = d3.select(this).attr("stroke-width") === "4";
            if (isActive) {
                lines.attr("stroke-width", 2).attr("opacity", 1);
                markers.attr("r", 4).attr("opacity", 1);
            } else {
                lines.attr("stroke-width", 2).attr("opacity", 0.3);
                markers.attr("r", 4).attr("opacity", 0.3);
                d3.select(this).attr("stroke-width", 4).attr("opacity", 1);
                markers.filter(m => m["Nhóm hàng"] === d[0]).attr("r", 6).attr("opacity", 1);
            }
        });

    const markers = chart.selectAll(".marker")
        .data(finalData)
        .enter()
        .append("circle")
        .attr("class", "marker")
        .attr("cx", d => x(d["Tháng"]) + x.bandwidth() / 2)
        .attr("cy", d => y(d["Xác suất bán"]))
        .attr("r", 4)
        .attr("fill", d => colorScale(d["Nhóm hàng"]))
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <p><strong>${d["Tháng"]}</strong></p>
                <p><strong>Nhóm hàng: ${d["Nhóm hàng"]}</strong></p>
                <p><strong>SL Đơn Bán:</strong> ${d["SL Đơn Bán"].toLocaleString()}</p>
                <p><strong>Xác suất Bán:</strong> ${d["Xác suất bán"].toFixed(1)}%</p>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            const isActive = d3.select(this).attr("r") === "6";
            if (isActive) {
                lines.attr("stroke-width", 2).attr("opacity", 1);
                markers.attr("r", 4).attr("opacity", 1);
            } else {
                lines.attr("stroke-width", 2).attr("opacity", 0.3);
                markers.attr("r", 4).attr("opacity", 0.3);
                d3.select(this).attr("r", 6).attr("opacity", 1);
                lines.filter(l => l[0] === d["Nhóm hàng"]).attr("stroke-width", 4).attr("opacity", 1);
            }
        });


    // Trục X
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "14px");


    // Trục Y
    chart.append("g")
        .call(d3.axisLeft(y)
            .tickFormat(d => `${d}%`) 
            .ticks(10) 
        )
        .style("font-size", "14px");


    const filter = svg.append("g")
        .attr("transform", `translate(${width + margin.left + 30},${margin.top})`); // Điều chỉnh vị trí filter


    const filterRects = filter.selectAll("rect")
        .data(colorScale.domain())
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("y", (d, i) => i * 25 )
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorScale)
        .on("click", function (event, selectedGroup) {
            const isActive = d3.select(this).attr("opacity") === "0.3";
            if (isActive) {
                lines.attr("stroke-width", 2).attr("opacity", 1);
                markers.attr("r", 4).attr("opacity", 1);
                filterRects.attr("opacity", 1); 
            } else {
                lines.attr("stroke-width", 2).attr("opacity", 0.3);
                markers.attr("r", 4).attr("opacity", 0.3);
                lines.filter(l => l[0] === selectedGroup).attr("stroke-width", 4).attr("opacity", 1);
                markers.filter(m => m["Nhóm hàng"] === selectedGroup).attr("r", 6).attr("opacity", 1);
                filterRects.attr("opacity", 0.3); 
                d3.select(this).attr("opacity", 1); 
            }
        });

    filter.selectAll("text")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 25 + 14)
        .text(d => d)
        .style("font-size", "14px");


    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left"); // Căn trái nội dung tooltip
});

// ------------ Q9--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (!window.data || !window.data.length || !Array.isArray(window.data)) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }


    const margin = { top: 24, right: 40, bottom: 70, left: 40 }, 
        width = 360, height = 250; 

    const innerLeft   = 80;         // chừa chỗ cho label Y
    const innerRight  = 12;
    const innerBottom = 24;

    const data9 = window.data.map(d => ({
        "Mã đơn hàng": d["Mã đơn hàng"],
        "Nhóm hàng": `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`,
        "Mặt hàng": `[${d["Mã mặt hàng"]}] ${d["Tên mặt hàng"]}`,
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0,
        "SL": parseFloat(d["SL"]) || 0,
        "Tháng tạo đơn": `Tháng ${new Date(d["Thời gian tạo đơn"]).getMonth() + 1}`
    }));

    const tong_nhom = d3.rollup(data9, v => new Set(v.map(d => d["Mã đơn hàng"])).size, d => d["Nhóm hàng"]);
    const df_grouped = d3.rollup(data9, v => new Set(v.map(d => d["Mã đơn hàng"])).size, d => d["Nhóm hàng"], d => d["Mặt hàng"]);

    const df_result = Array.from(df_grouped).flatMap(([group, items]) =>
        Array.from(items).map(([item, count]) => ({
            "Nhóm hàng": group,
            "Mặt hàng": item,
            "don_hang_mat_hang": count,
            "tong_don_theo_nhom": tong_nhom.get(group),
            "Xác suất bán": count / tong_nhom.get(group)
        }))
    );

    df_result.sort((a, b) => b["Xác suất bán"] - a["Xác suất bán"]);

    const COLS_TOP=3;
    const COLS_BOTTOM=2;
    const ROWS =2;
    const groupSpacing = (width + margin.left + margin.right); 

    const svg = d3.select("#Q9")
        .append("svg")
        .attr("width", groupSpacing * COLS_TOP+ margin.left * 2) 
        .attr("height", ROWS * (height + margin.top + margin.bottom) );

    const chartContainer = d3.select("#Q9")
        .style("display", "flex")
        .style("justify-content", "center");

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const groupedData = d3.groups(df_result, d => d["Nhóm hàng"]);

    const orderedGroups = ["[BOT] Bột", "[SET] Set trà", "[THO] Trà hoa", "[TMX] Trà mix", "[TTC] Trà củ, quả sấy"];
    const sortedGroupedData = orderedGroups.map(group => groupedData.find(g => g[0] === group)).filter(g => g);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "11px")
        .style("pointer-events", "none")
        .style("text-align", "left");

    
    sortedGroupedData.forEach(([group, data], index) => {
        const row = index < COLS_TOP ? 0 : 1;
        const colInRow = row ===0 ? index : index - COLS_TOP;
        
        const centerOffset = row === 0 ? 0 : (COLS_TOP - COLS_BOTTOM) / 2; // = 0.5
        const xOffset = colInRow  * groupSpacing;
        const yOffset = row * (height + margin.top + margin.bottom);

        const groupChart = chart.append("g")
            .attr("transform", `translate(${xOffset + innerLeft},${row * (height + margin.bottom)})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Xác suất bán"]) * 1.1]) // Giới hạn chiều dài thanh
            .range([0, width - margin.left - margin.right]);
       
        const y = d3.scaleBand()
            .domain(data.map(d => d["Mặt hàng"]))
            .range([0, height])
            .padding(0.3);

        const bars = groupChart.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => y(d["Mặt hàng"]))
            .attr("width", d => x(d["Xác suất bán"]))
            .attr("height", y.bandwidth())
            .attr("fill", d => colorScale(d["Mặt hàng"]))
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`
                    <strong>Mặt hàng:</strong> ${d["Mặt hàng"]}<br>
                    <strong>Nhóm hàng:</strong> ${d["Nhóm hàng"]}<br>
                    <strong>SL Đơn Bán:</strong> ${d["don_hang_mat_hang"].toLocaleString()}<br>
                    <strong>Xác suất Bán / Nhóm hàng:</strong> ${(d["Xác suất bán"] * 100).toFixed(0)}%
                `)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .style("font-size", "14px");
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function (event, d) {
                const isActive = d3.select(this).attr("opacity") === "0.3";
                if (isActive) {
                    bars.attr("opacity", 1);
                } else {
                    bars.attr("opacity", 0.3);
                    d3.select(this).attr("opacity", 1);
                }
            });


        groupChart.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => x(d["Xác suất bán"]) - 5)
            .attr("y", d => y(d["Mặt hàng"]) + y.bandwidth() / 2)
            .attr("dy", ".35em")
            .text(d => `${(d["Xác suất bán"] * 100).toFixed(1)}%`)
            .style("font-size", "11px")
            .style("fill", "white")
            .style("text-anchor", "end");

        groupChart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d => `${(d * 100).toFixed(0)}%`).ticks(4))
            .style("font-size", "9px");

        groupChart.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "9px")
            .style("text-anchor", "end");

        groupChart.append("text")
            .attr("x", width / 2 - margin.left) 
            .attr("y", -5)
            .attr("text-anchor", "middle") 
            .attr("font-size", "13px")
            .attr("font-weight", "bold")
            .text(group);


    });
});

// ------------ Q10--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const width = 450,
        height = 250,
        margin = { top: 16, right: 40, bottom: 8, left: 96 };

    const data_processed = data.map(d => ({
        "Tháng": `T ${d["Thời gian tạo đơn"].split("-")[1]}`,
        "Nhóm hàng": `[${d["Mã nhóm hàng"]}] ${d["Tên nhóm hàng"]}`,
        "Mặt hàng": `[${d["Mã mặt hàng"]}] ${d["Tên mặt hàng"]}`,
        "Mã đơn hàng": d["Mã đơn hàng"]
    }));

    const totalOrdersByGroupMonth = {};
    const itemOrdersByGroupMonth = {};

    data_processed.forEach(({ "Nhóm hàng": group, "Mặt hàng": item, "Tháng": month, "Mã đơn hàng": orderID }) => {
        if (!totalOrdersByGroupMonth[group]) totalOrdersByGroupMonth[group] = {};
        if (!totalOrdersByGroupMonth[group][month]) totalOrdersByGroupMonth[group][month] = new Set();
        totalOrdersByGroupMonth[group][month].add(orderID);

        const key = `${group}|||${item}|||${month}`;
        if (!itemOrdersByGroupMonth[key]) itemOrdersByGroupMonth[key] = new Set();
        itemOrdersByGroupMonth[key].add(orderID);
    });

    const probabilityData = {};
    Object.keys(itemOrdersByGroupMonth).forEach(key => {
        const [group, item, month] = key.split("|||");

        if (!probabilityData[group]) probabilityData[group] = [];
        probabilityData[group].push({
            "Tháng": month,
            "Mặt hàng": item,
            "Nhóm hàng": group,
            "Xác suất": itemOrdersByGroupMonth[key].size / totalOrdersByGroupMonth[group][month].size
        });
    });

    Object.values(probabilityData).forEach(data => {
        data.sort((a, b) => parseInt(a["Tháng"].split(" ")[1]) - parseInt(b["Tháng"].split(" ")[1]));
    });

    const chartContainer = d3.select("#Q10");
    chartContainer.html("");

    chartContainer.style("display", "grid")
        .style("grid-template-columns", "repeat(3, 1fr)")
        .style("gap", "8px")
        .style("justify-content", "center");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "8px")
        .style("pointer-events", "none")
        .style("text-align", "left");

    const groupOrder = [
        "[BOT] Bột",
        "[SET] Set trà",
        "[THO] Trà hoa",
        "[TMX] Trà mix",
        "[TTC] Trà củ, quả sấy"
    ];
    const orderMap = new Map(groupOrder.map((k, i) => [k, i]));
    const orderedEntries = Object.entries(probabilityData).sort(([k1], [k2]) => {
        const a = orderMap.has(k1) ? orderMap.get(k1) : 999;
        const b = orderMap.has(k2) ? orderMap.get(k2) : 999;
        return a === b ? k1.localeCompare(k2) : a - b;
    });
    
    orderedEntries.forEach(([group, data]) => {
        const div = chartContainer.append("div")
            .style("display", "inline-block")
            .style("margin", 0)
            .style("vertical-align", "top");

        div.append("h3").text(group)
            .style("text-align", "center")
            .style("font-size", "20x");

        const svg = div.append("svg")
            .attr("width", width)
            .attr("height", height);

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scalePoint()
            .domain([...new Set(data.map(d => d["Tháng"]))])
            .range([0, width - margin.left - margin.right])
            .padding(0.5);

        const isBotBot = group === "[BOT] Bột";
        const yDomain = isBotBot
            ? [0.9, 1.1]
            : [d3.min(data, d => d["Xác suất"]), d3.max(data, d => d["Xác suất"])];

        const y = d3.scaleLinear()
            .domain(yDomain)
            .range([height - margin.top - margin.bottom, 0])
            .nice();

        chart.append("g")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x))
            .style("font-size", "12px");

        chart.append("g")
            .call(d3.axisLeft(y).tickFormat(d3.format(".0%")).ticks(5))
            .style("font-size", "12px");

        const items = [...new Set(data.map(d => d["Mặt hàng"]))];
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const lines = chart.selectAll(".line-group")
            .data(items)
            .enter()
            .append("g")
            .attr("class", "line-group");

        lines.each(function (item) {
            const itemData = data.filter(d => d["Mặt hàng"] === item);
            const line = d3.line()
                .x(d => x(d["Tháng"]))
                .y(d => y(d["Xác suất"]));

            d3.select(this).append("path")
                .datum(itemData)
                .attr("fill", "none")
                .attr("stroke", color(item))
                .attr("stroke-width", 2)
                .attr("class", "line")
                .attr("d", line)
                .on("click", function () {
                    const isActive = d3.select(this).classed("active");
                    d3.selectAll(".line").style("opacity", isActive ? 1 : 0.3);
                    d3.select(this).style("opacity", 1).classed("active", !isActive);
                });
        });

        chart.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d["Tháng"]))
            .attr("cy", d => y(d["Xác suất"]))
            .attr("r", 4)
            .attr("fill", d => color(d["Mặt hàng"]))
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                tooltip.html(`
                    <strong>Tháng:</strong> ${d["Tháng"]} <br>
                    <strong>Nhóm hàng:</strong> ${d["Nhóm hàng"]} <br>
                    <strong>Mặt hàng:</strong> ${d["Mặt hàng"]} <br>
                    <strong>Xác suất bán:</strong> ${(d["Xác suất"] * 100).toFixed(2)}%
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseleave", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        const legend = div.append("div")
            .style("text-align", "center")
            .style("display", "flex")
            .style("flex-wrap", "wrap")
            .style("justify-content", "center")
            .style("max-width", "90%")
            .style("margin", "10px auto");

        items.forEach(item => {
            const legendItem = legend.append("div")
                .style("display", "flex")
                .style("align-items", "center")
                .style("margin", "5px 10px");

            legendItem.append("div")
                .style("width", "12px")
                .style("height", "12px")
                .style("background-color", color(item))
                .style("margin-right", "5px");

            legendItem.append("span")
                .style("font-size", "12px")
                .text(item);
        });
    });
});

// ------------ Q11--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (!Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 40, bottom: 50, left: 60 },
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const aggregatedData = Array.from(
        d3.rollup(window.data,
            v => new Set(v.map(d => d["Mã đơn hàng"])).size,
            d => d["Mã khách hàng"]
        ),
        ([key, value]) => ({ "Mã khách hàng": key, "Số lượt mua hàng": value })
    );

    const purchaseCountData = Array.from(
        d3.rollup(aggregatedData,
            v => v.length,
            d => d["Số lượt mua hàng"]
        ),
        ([key, value]) => ({ "Số lượt mua hàng": key, "Số lượng KH": value })
    );

    purchaseCountData.sort((a, b) => a["Số lượt mua hàng"] - b["Số lượt mua hàng"]);

    const svg = d3.select("#Q11")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(purchaseCountData.map(d => d["Số lượt mua hàng"].toString()))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 5000])
        .range([height, 0]);

    const bars = svg.selectAll(".bar")
        .data(purchaseCountData)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", d => x(d["Số lượt mua hàng"].toString()))
        .attr("y", d => y(d["Số lượng KH"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Số lượng KH"]))
        .attr("fill", "steelblue") // Đặt màu mặc định cho tất cả các thanh
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <p><strong>Đã mua ${d["Số lượt mua hàng"]} lần</strong></p>
                <p><strong>Số lượng KH:</strong> ${d["Số lượng KH"].toLocaleString()}</p>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3);
                d3.select(this).attr("opacity", 1);
            } else {
                bars.attr("opacity", 1);
            }
        });

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "14px");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .style("font-size", "14px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left");
});

// ------------ Q12--------------//
document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.data === "undefined" || !Array.isArray(window.data) || window.data.length === 0) {
        console.error("Dữ liệu chưa được load hoặc rỗng!");
        return;
    }

    console.log("Dữ liệu đã load:", window.data);

    const margin = { top: 40, right: 40, bottom: 80, left: 50 },
        width = 1250,
        height = 500;

    const data12 = window.data.map(d => ({
        "Mã khách hàng": d["Mã khách hàng"],
        "Thành tiền": parseFloat(d["Thành tiền"]) || 0
    }));
    const chitieukh = Array.from(
        d3.rollup(data12,
            v => d3.sum(v, d => d["Thành tiền"]),
            d => d["Mã khách hàng"]
        ),
        ([key, value]) => ({ "Mã khách hàng": key, "Chi tiêu KH": value })
    );

    const binsize = 50000;
    let binneddata = Array.from(
        d3.rollup(chitieukh,
            v => v.length,
            d => Math.floor(d["Chi tiêu KH"] / binsize) * binsize
        ),
        ([key, value]) => ({
            "Khoảng chi tiêu": `Từ ${key} đến ${key + binsize}`,
            "Số lượng KH": value,
            "Chi tiêu KH": key
        })
    );

    if (binneddata.length > 0) {
        binneddata.sort((a, b) => a["Chi tiêu KH"] - b["Chi tiêu KH"]);
    }

    const svg = d3.select("#Q12")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(binneddata.map(d => `${d["Chi tiêu KH"] / 1000}K`))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(binneddata, d => d["Số lượng KH"]) || 1600])
        .range([height, 0]);

    const bars = chart.selectAll(".bar")
        .data(binneddata)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "bar")
        .attr("x", d => x(`${d["Chi tiêu KH"] / 1000}K`))
        .attr("y", d => y(d["Số lượng KH"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Số lượng KH"]))
        .attr("fill", "steelblue")
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <p><strong>Đã chi tiêu ${d["Khoảng chi tiêu"]}</strong></p>
                <p><strong>Số lượng KH:</strong> ${d["Số lượng KH"].toLocaleString()}</p>
            `)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("font-size", "14px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            if (d3.select(this).attr("opacity") !== "0.3") {
                bars.attr("opacity", 0.3);
                d3.select(this).attr("opacity", 1);
            } else {
                bars.attr("opacity", 1);
            }
        });

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("font-size", "12px")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-90)");

    chart.append("g")
        .call(d3.axisLeft(y).ticks(16))
        .style("font-size", "14px");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("text-align", "left");
});
