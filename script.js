document.addEventListener("input", function () {
    // discount calculation
    const ids = ["d10", "d15", "d20", "d25", "d40b", "d40m", "d50"];
    const aid = ["a10", "a15", "a20", "a25", "a40b", "a40m", "a50"];
    let totalDiscount = 0;

    for (let i = 0; i < ids.length; i++) {
        const inputVal = document.getElementById(ids[i]).value.trim();
        if (inputVal !== "") {
            //changes string to array, changes char array to num array, filters the array for numbers
            const numbers = inputVal.split(" ").map(Number).filter(n => !isNaN(n));

            //sums the array
            const sum = numbers.reduce((acc, curr) => acc + curr, 0);
            document.getElementById(aid[i]).value = sum.toFixed(2);
            totalDiscount += sum;
        } else {
            document.getElementById(aid[i]).value = "";
        }
    }
    document.getElementById("totalDiscount").value = totalDiscount.toFixed(2);

    // total sales
    const categories = ["beverage", "ntc", "food", "bakery", "merchandise", "beerandwine"];
    let totalSales = 0;
    categories.forEach(cls => {
        let el = document.querySelector(`.${cls}`);
        let val = parseFloat(el.value);
        if (!isNaN(val)) totalSales += val;
    });
    document.querySelector(".totalsale").value = (totalSales - document.querySelector(".ntc").value).toFixed(2);

    // total payment
    const paymentTypes = ["cash", "card", "fonepay", "credit"];
    let totalPayment = 0;
    paymentTypes.forEach(cls => {
        let el = document.querySelector(`.${cls}`);
        let val = parseFloat(el.value);
        if (!isNaN(val)) totalPayment += val;
    });
    document.querySelector(".totalpayment").value = totalPayment.toFixed(2);

    // apc and apt calc
    const transaction = parseFloat(document.querySelector(".transaction").value);
    const pax = parseFloat(document.querySelector(".pax").value);

    if (!isNaN(pax) && pax !== 0) {
        document.querySelector(".apc").value = (totalSales / pax).toFixed(2);
    } else {
        document.querySelector(".apc").value = "";
    }

    if (!isNaN(transaction) && transaction !== 0) {
        document.querySelector(".apt").value = (totalSales / transaction).toFixed(2);
    } else {
        document.querySelector(".apt").value = "";
    }
});

const generateBtn = document.getElementById("generateSalesReportButton");
const reportArea = document.getElementById("textarea");

generateBtn.addEventListener("click", function () {
    // trigger recalculation just to be sure
    document.dispatchEvent(new Event("input")); //simulates input change event listner for recalc.

    const getVal = key => {
        const val = document.getElementById(key)?.value.trim()
            || document.querySelector(`.${key}`)?.value.trim();
        return val || "**";
    };
    
    const report = `
Himalayan Java Coffee Pvt Ltd.
Naxal, Narayanchaur
Sales report of ${new Date().toDateString()}

1. Total sales : ${getVal("totalsale")}

a. Beverages : ${getVal("beverage")}
b. Bakery : ${getVal("bakery")}
c. Food : ${getVal("food")}
d. Merchandise : ${getVal("merchandise")}
e. Nepali Tea Collective: ${getVal("ntc")}
f. Beer and Wine: ${getVal("beerandwine")}

Somersby Apple Cider: **
Barahsinghe Belgian Witbier: **
Barahsinghe Hazy IPA: **
Barahsinghe Pilsner: **
Barahsinghe Pale Ale: **
Budwiser Beer: **
Corona Beer: **
Gorkha: **
Tuborg: **
Glass two ocean cabernet sauvignon merlot: **
Glass two ocean chardonnay: **

2. Type of payment :-
a. Cash : ${getVal("cash")}
b. Card : ${getVal("card")}
c. Fonepay : ${getVal("fonepay")}
d. Credit : ${getVal("credit")}

3. Total discount amount: ${getVal("totalDiscount")}
a. 10% : ${getVal("a10")}
b. 15% : ${getVal("a15")}
c. 20% : ${getVal("a20")}
d. 25% : ${getVal("a25")}
e. 40% : ${getVal("a40b")}
f. Staff discount : ${getVal("a50")}

6. No. of transactions : ${getVal("transaction")}

7. No. of pax : ${getVal("pax")}

8. APC : ${getVal("apc")}

9. APT : ${getVal("apt")}

10. Takeaway cups :
a. 8 oz : **
b. 12 oz : **
c. 16 oz paper : **
d. 16 oz plastic : **

11. Total app sales: **

Thank you!!
`;

    reportArea.value = report;
    console.log(getVal("beverage"));
    console.log(getVal("a10"));
});

// save inputs to local storage
function saveInputs() {
    const inputs = document.querySelectorAll("input");
    const data = {};
    inputs.forEach(input => {
        if (input.id) {
            data[input.id] = input.value;
        }
    });
    localStorage.setItem("salesData", JSON.stringify(data));
}

// load saved inputs on reload
function loadInputs() {
    const saved = JSON.parse(localStorage.getItem("salesData") || "{}");
    for (const id in saved) {
        const input = document.getElementById(id);
        if (input) {
            input.value = saved[id];
            input.dispatchEvent(new Event("input")); // trigger calculations again after reload
        }
    }
}

document.addEventListener("input", saveInputs);
window.addEventListener("DOMContentLoaded", loadInputs);

function clearSaved() {
    localStorage.removeItem("salesData");
    location.reload(); 
}

//copy sales report
function copy() {
    const reportText = reportArea.value;

    navigator.clipboard.writeText(reportText)
        .then(() => {
            document.getElementById("btn").innerText="Copied!";
            setTimeout(() => {
                document.getElementById("btn").innerText="Copy";
            }, 2000);
        })
        .catch(err => {
            console.error("Copy failed", err);
            alert("Failed to copy sales report.");
        });
}
