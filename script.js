const API_URL = "https://script.google.com/macros/s/AKfycbwDvI3IlRFK0Cgq6-O4I2iaC1V98Jhz9ubvdFbRHfWE4FdLFUPQYfcPLHeGLGKdhxLz5A/exec";

// Data grafik
let waktuData = [];
let suhuData = [];
let getaranData = [];
let suaraData = [];

// =================== GRAFIK ===================

const chartSuhu = new Chart(document.getElementById("chartSuhu"), {
    type: "line",
    data: {
        labels: waktuData,
        datasets: [{
            label: "Suhu (°C)",
            data: suhuData,
            borderColor: "red",
            fill: false
        }]
    }
});

const chartGetaran = new Chart(document.getElementById("chartGetaran"), {
    type: "line",
    data: {
        labels: waktuData,
        datasets: [{
            label: "Getaran (mm/s)",
            data: getaranData,
            borderColor: "blue",
            fill: false
        }]
    }
});

const chartSuara = new Chart(document.getElementById("chartSuara"), {
    type: "line",
    data: {
        labels: waktuData,
        datasets: [{
            label: "Suara (dB)",
            data: suaraData,
            borderColor: "green",
            fill: false
        }]
    }
});

// =================== AMBIL DATA ===================

async function ambilData(){

    try{

        const response = await fetch(API_URL);

        const data = await response.json();

        document.getElementById("suhu").innerHTML =
        data.suhu.toFixed(1)+" °C";

        document.getElementById("getaran").innerHTML =
        data.getaran.toFixed(2)+" mm/s";

        document.getElementById("suara").innerHTML =
        data.suara.toFixed(1)+" dB";

        document.getElementById("waktu").innerHTML =
        data.waktu;

        // ===== STATUS SUHU =====
if (data.suhu > 35) {
    document.getElementById("statusSuhu").innerHTML = "🔴 Tinggi";
} else {
    document.getElementById("statusSuhu").innerHTML = "🟢 Normal";
}

// ===== STATUS GETARAN =====
if (data.getaran > 2.80) {
    document.getElementById("statusGetaran").innerHTML = "🔴 Tinggi";
} else {
    document.getElementById("statusGetaran").innerHTML = "🟢 Normal";
}

// ===== STATUS SUARA =====
if (data.suara > 80) {
    document.getElementById("statusSuara").innerHTML = "🔴 Tinggi";
} else {
    document.getElementById("statusSuara").innerHTML = "🟢 Normal";
}

        // ================= STATUS =================

        let status="🟢 NORMAL";
        let kelas="normal";

        if(
            data.suhu>30 ||
            data.getaran>2.40 ||
            data.suara>80
        ){
            status="🟡 WARNING";
            kelas="warning";
        }

        if(
            data.suhu>35 &&
            data.getaran>2.80 &&
            data.suara>90
        ){
            status="🔴 BAHAYA";
            kelas="bahaya";
        }

        const statusMotor=document.getElementById("statusMotor");

        statusMotor.innerHTML=status;
        statusMotor.className=kelas;

        // ================= GRAFIK =================

        waktuData.push(new Date().toLocaleTimeString());

        suhuData.push(data.suhu);
        getaranData.push(data.getaran);
        suaraData.push(data.suara);

        if(waktuData.length>20){

            waktuData.shift();

            suhuData.shift();
            getaranData.shift();
            suaraData.shift();

        }

        chartSuhu.update();
        chartGetaran.update();
        chartSuara.update();

    }

    catch(error){

        console.log(error);

    }

}

ambilData();

setInterval(ambilData,1000);
