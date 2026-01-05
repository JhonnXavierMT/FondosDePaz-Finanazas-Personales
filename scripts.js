const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const labels = ["Vivienda", "Comida", "Transporte", "Salud", "Ocio"];

function calcular() {
  const vals = [
    parseFloat(document.getElementById("vivienda").value) || 0,
    parseFloat(document.getElementById("comida").value) || 0,
    parseFloat(document.getElementById("transporte").value) || 0,
    parseFloat(document.getElementById("salud").value) || 0,
    parseFloat(document.getElementById("ocio").value) || 0,
  ];

  const mensual = vals.reduce((a, b) => a + b, 0);
  const anual = mensual * 12;
  const metaCasa = parseFloat(document.getElementById("metaCasa").value) || 0;
  const metaAuto = parseFloat(document.getElementById("metaAuto").value) || 0;
  const total = anual + metaCasa + metaAuto;

  document.getElementById("resMensual").innerText =
    mensual.toLocaleString("es-BO");
  document.getElementById("resAnual").innerText = anual.toLocaleString("es-BO");

  // Hoja de Ruta con espaciado mejorado
  document.getElementById("analisis-metas").innerHTML = `
                <div class="flex justify-between items-center py-4 border-b border-slate-100">
                    <span class="text-slate-500 font-medium">Seguridad: Fondo de Paz</span>
                    <span class="text-slate-500 font-medium">(12 meses)</span>
                    <span class="font-bold text-slate-900 text-lg">Bs ${anual.toLocaleString(
                      "es-BO"
                    )}</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-slate-100">
                    <span class="text-slate-500 font-medium">Vivienda: Pago Estimado</span>
                    <span class="font-bold text-slate-900 text-lg">Bs ${metaCasa.toLocaleString(
                      "es-BO"
                    )}</span>
                </div>
                <div class="flex justify-between items-center py-4 border-b border-slate-100">
                    <span class="text-slate-500 font-medium">Vehículo: Presupuesto Compra</span>
                    <span class="font-bold text-slate-900 text-lg">Bs ${metaAuto.toLocaleString(
                      "es-BO"
                    )}</span>
                </div>
                <div class="mt-8 p-6 bg-slate-50 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Capital Total Necesario</p>
                        <p class="text-3xl font-black text-slate-900">Bs ${total.toLocaleString(
                          "es-BO"
                        )}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-emerald-600 text-xs font-bold uppercase tracking-widest">Ahorro Mensual (24 Meses)</p>
                        <p class="text-2xl font-black text-emerald-700">Bs ${(
                          total / 24
                        )
                          .toFixed(0)
                          .toLocaleString("es-BO")}</p>
                    </div>
                </div>
            `;

  drawSvgDonut(vals, mensual);
}

function drawSvgDonut(values, total) {
  const container = document.getElementById("donut-segments");
  const legend = document.getElementById("chart-legend");
  container.innerHTML = "";
  legend.innerHTML = "";

  let currentPercent = 0;

  values.forEach((val, i) => {
    const percent = (val / total) * 100;
    if (percent > 0) {
      const offset = 100 - currentPercent + 25;
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "21");
      circle.setAttribute("cy", "21");
      circle.setAttribute("r", "15.915");
      circle.setAttribute("fill", "transparent");
      circle.setAttribute("stroke", colors[i]);
      circle.setAttribute("stroke-width", "6");
      circle.setAttribute("stroke-dasharray", `${percent} ${100 - percent}`);
      circle.setAttribute("stroke-dashoffset", offset);
      circle.classList.add("donut-ring");
      container.appendChild(circle);
    }

    // Leyenda
    legend.innerHTML += `
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full" style="background:${
                          colors[i]
                        }"></div>
                        <span class="text-slate-600 font-medium">${
                          labels[i]
                        }:</span>
                        <span class="font-bold text-slate-800">${percent.toFixed(
                          0
                        )}%</span>
                    </div>
                `;
    currentPercent += percent;
  });
}

async function exportarPDF() {
  const btn = document.getElementById("btn-descarga");
  const element = document.getElementById("reporte-contenido");
  btn.innerText = "Procesando...";
  btn.disabled = true;

  const opt = {
    margin: [0.4, 0.4, 0.4, 0.4],
    filename: "Reporte_Estrategico_Financiero.pdf",
    image: {
      type: "jpeg",
      quality: 1,
    },
    html2canvas: {
      scale: 3,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
    },
  };

  try {
    const resultados = document.getElementById("seccion-resultados");
    resultados.classList.remove("lg:col-span-2");
    await html2pdf().set(opt).from(element).save();
    resultados.classList.add("lg:col-span-2");
  } finally {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V40a8,8,0,0,0-16,0v84.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path></svg> Descargar Reporte PDF`;
    btn.disabled = false;
  }
}

window.onload = calcular;
