let proprietari = [
    {
        nome: 'Giuseppe Spiteri',
        via: 'Via Corbari 269',
        cap_citta_provincia: '48018, Faenza (RA)',
        cf_piva: 'SPTGPP80E07D458Q'
    },
    {
        nome: 'Riccardo Casamassima',
        via: 'Via Vittorio Veneto 31',
        cap_citta_provincia: '48018, Faenza (RA)',
        cf_piva: 'CSMRCR65H20D458A'
    }
];

let currentForm = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataRicevuta').value = today;

    // Populate proprietari dropdown
    updateProprietariDropdown();

    // Add event listeners
    document.getElementById('checkIn').addEventListener('change', calculateNights);
    document.getElementById('checkOut').addEventListener('change', calculateNights);
    document.getElementById('totalePernottamenti').addEventListener('change', calculateTotal);
    document.getElementById('extra').addEventListener('change', calculateTotal);
    document.getElementById('tassaSoggiorno').addEventListener('change', calculateTotal);
    document.getElementById('marcaBollo').addEventListener('change', calculateTotal);
});

function updateProprietariDropdown() {
    const select = document.getElementById('nomeProprietario');
    select.innerHTML = '<option value="">-- Seleziona Proprietario --</option>';

    proprietari.forEach(p => {
        const option = document.createElement('option');
        option.value = p.nome;
        option.textContent = p.nome;
        select.appendChild(option);
    });
}

function updateProprietariTable() {
    const tbody = document.getElementById('proprietariTableBody');
    tbody.innerHTML = '';

    proprietari.forEach((p, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.nome}</td>
            <td>${p.via}</td>
            <td>${p.cap_citta_provincia}</td>
            <td>${p.cf_piva}</td>
            <td>
                <button class="btn-danger" onclick="deleteProprietario(${index})">Elimina</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function onProprietarioChange() {
    const selected = document.getElementById('nomeProprietario').value;
    const prop = proprietari.find(p => p.nome === selected);

    if (prop) {
        document.getElementById('viaProprietario').value = prop.via;
        document.getElementById('capProprietario').value = prop.cap_citta_provincia;
        document.getElementById('cfProprietario').value = prop.cf_piva;
    } else {
        document.getElementById('viaProprietario').value = '';
        document.getElementById('capProprietario').value = '';
        document.getElementById('cfProprietario').value = '';
    }
}

function calculateNights() {
    const checkIn = new Date(document.getElementById('checkIn').value);
    const checkOut = new Date(document.getElementById('checkOut').value);

    if (checkIn && checkOut && checkOut > checkIn) {
        const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        document.getElementById('numeroNotti').value = nights;
        calculateTotal();
    } else {
        document.getElementById('numeroNotti').value = '';
    }
}

function calculateTotal() {
    const totale = parseFloat(document.getElementById('totalePernottamenti').value) || 0;
    const extra = parseFloat(document.getElementById('extra').value) || 0;
    const tassa = parseFloat(document.getElementById('tassaSoggiorno').value) || 0;
    const marca = parseFloat(document.getElementById('marcaBollo').value) || 0;

    const total = totale + extra + tassa + marca;
    document.getElementById('totalePagato').value = total.toFixed(2);
}

function validateRequired() {
    const nomeProprietario = document.getElementById('nomeProprietario').value;
    const nomeOspite = document.getElementById('nomeOspite').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const totale = document.getElementById('totalePernottamenti').value;

    if (!nomeProprietario || !nomeOspite || !checkIn || !checkOut || !totale) {
        alert('Per favore compila tutti i campi obbligatori!');
        return false;
    }
    return true;
}

function gatherFormData() {
    return {
        numeroRicevuta: document.getElementById('numeroRicevuta').value,
        dataRicevuta: document.getElementById('dataRicevuta').value,
        nomeProprietario: document.getElementById('nomeProprietario').value,
        viaProprietario: document.getElementById('viaProprietario').value,
        capProprietario: document.getElementById('capProprietario').value,
        cfProprietario: document.getElementById('cfProprietario').value,
        nomeOspite: document.getElementById('nomeOspite').value,
        indirizzoOspite: document.getElementById('indirizzoOspite').value,
        capOspite: document.getElementById('capOspite').value,
        cfOspite: document.getElementById('cfOspite').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        numeroNotti: document.getElementById('numeroNotti').value,
        totalePernottamenti: document.getElementById('totalePernottamenti').value,
        extra: document.getElementById('extra').value,
        tassaSoggiorno: document.getElementById('tassaSoggiorno').value,
        marcaBollo: document.getElementById('marcaBollo').value,
        totalePagato: document.getElementById('totalePagato').value
    };
}

function generateReceipt() {
    if (!validateRequired()) return;

    // Save current form data
    currentForm = gatherFormData();

    // Populate receipt
    populateReceipt();

    // Show receipt view
    document.getElementById('formView').classList.add('hidden');
    document.getElementById('receiptView').classList.remove('hidden');
}

function populateReceipt() {
    document.getElementById('rNumeroRicevuta').textContent = currentForm.numeroRicevuta || '---';
    document.getElementById('rDataRicevuta').textContent = formatDate(currentForm.dataRicevuta);
    document.getElementById('rNomeProprietario').textContent = currentForm.nomeProprietario;
    document.getElementById('rViaProprietario').textContent = currentForm.viaProprietario;
    document.getElementById('rCapProprietario').textContent = currentForm.capProprietario;
    document.getElementById('rCfProprietario').textContent = currentForm.cfProprietario;
    document.getElementById('rNomeOspite').textContent = currentForm.nomeOspite;
    document.getElementById('rIndirizzoOspite').textContent = currentForm.indirizzoOspite || '---';
    document.getElementById('rCapOspite').textContent = currentForm.capOspite || '---';
    document.getElementById('rCheckIn').textContent = formatDate(currentForm.checkIn);
    document.getElementById('rCheckOut').textContent = formatDate(currentForm.checkOut);
    document.getElementById('rNumeroNotti').textContent = currentForm.numeroNotti;
    document.getElementById('rTotalePernottamenti').textContent = '€ ' + (parseFloat(currentForm.totalePernottamenti)||0).toFixed(2);
    document.getElementById('rExtra').textContent = '€ ' + (parseFloat(currentForm.extra)||0).toFixed(2);
    document.getElementById('rTassaSoggiorno').textContent = '€ ' + (parseFloat(currentForm.tassaSoggiorno)||0).toFixed(2);
    document.getElementById('rMarcaBollo').textContent = '€ ' + (parseFloat(currentForm.marcaBollo)||0).toFixed(2);
    document.getElementById('rTotalePagato').textContent = '€ ' + (parseFloat(currentForm.totalePagato)||0).toFixed(2);
}

function formatDate(dateStr) {
    if (!dateStr) return '---';
    const date = new Date(dateStr + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function editReceipt() {
    document.getElementById('receiptView').classList.add('hidden');
    document.getElementById('formView').classList.remove('hidden');
}

function newReceipt() {
    resetForm();
    document.getElementById('receiptView').classList.add('hidden');
    document.getElementById('formView').classList.remove('hidden');
}

function resetForm() {
    document.getElementById('numeroRicevuta').value = '';
    document.getElementById('dataRicevuta').value = new Date().toISOString().split('T')[0];
    document.getElementById('nomeProprietario').value = '';
    document.getElementById('viaProprietario').value = '';
    document.getElementById('capProprietario').value = '';
    document.getElementById('cfProprietario').value = '';
    document.getElementById('nomeOspite').value = '';
    document.getElementById('indirizzoOspite').value = '';
    document.getElementById('capOspite').value = '';
    document.getElementById('cfOspite').value = '';
    document.getElementById('checkIn').value = '';
    document.getElementById('checkOut').value = '';
    document.getElementById('numeroNotti').value = '';
    document.getElementById('totalePernottamenti').value = '';
    document.getElementById('extra').value = '0';
    document.getElementById('tassaSoggiorno').value = '0';
    document.getElementById('marcaBollo').value = '2.00';
    document.getElementById('totalePagato').value = '0.00';
}

function openProprietariModal() {
    updateProprietariTable();
    document.getElementById('proprietariModal').classList.remove('hidden');
}

function closeProprietariModal() {
    document.getElementById('proprietariModal').classList.add('hidden');
    document.getElementById('newProprietarioNome').value = '';
    document.getElementById('newProprietarioVia').value = '';
    document.getElementById('newProprietarioCap').value = '';
    document.getElementById('newProprietarioCF').value = '';
    updateProprietariDropdown();
}

function addProprietario() {
    const nome = document.getElementById('newProprietarioNome').value.trim();
    const via = document.getElementById('newProprietarioVia').value.trim();
    const cap = document.getElementById('newProprietarioCap').value.trim();
    const cf = document.getElementById('newProprietarioCF').value.trim();

    if (!nome || !via || !cap || !cf) {
        alert('Per favore compila tutti i campi!');
        return;
    }

    proprietari.push({
        nome,
        via,
        cap_citta_provincia: cap,
        cf_piva: cf
    });

    updateProprietariTable();
    updateProprietariDropdown();

    document.getElementById('newProprietarioNome').value = '';
    document.getElementById('newProprietarioVia').value = '';
    document.getElementById('newProprietarioCap').value = '';
    document.getElementById('newProprietarioCF').value = '';

    alert('Proprietario aggiunto con successo!');
}

function deleteProprietario(index) {
    if (confirm('Sei sicuro di voler eliminare questo proprietario?')) {
        proprietari.splice(index, 1);
        updateProprietariTable();
        updateProprietariDropdown();
    }
}

/* ---------- PDF Generation ---------- */

function getFilename() {
    const num = document.getElementById('numeroRicevuta').value || 'ricevuta';
    const ospite = (document.getElementById('nomeOspite').value || '').replace(/\s+/g, '_');
    const data = document.getElementById('dataRicevuta').value || new Date().toISOString().split('T')[0];
    return `${num}_${ospite}_${data}.pdf`;
}

function downloadPDF() {
    // Ensure receipt is populated
    if (!currentForm || !currentForm.nomeOspite) {
        alert('Genera prima l\'anteprima della ricevuta.');
        return;
    }
    const element = document.getElementById('receiptContainer');

    const opt = {
        margin: [10, 10, 10, 10],
        filename: getFilename(),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // use html2pdf to save
    html2pdf().set(opt).from(element).save();
}

function generateAndDownloadPDF() {
    // Validate and gather data
    if (!validateRequired()) return;

    currentForm = gatherFormData();
    populateReceipt();

    // Show receipt (temporarily) to ensure styles render correctly
    const formView = document.getElementById('formView');
    const receiptView = document.getElementById('receiptView');
    const wasVisible = !receiptView.classList.contains('hidden');

    formView.classList.add('hidden');
    receiptView.classList.remove('hidden');

    const element = document.getElementById('receiptContainer');
    const filename = getFilename();

    const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate and download, then restore previous UI state
    html2pdf().set(opt).from(element).save().then(() => {
        // restore view after a short delay to give browser time
        setTimeout(() => {
            if (!wasVisible) {
                receiptView.classList.add('hidden');
                formView.classList.remove('hidden');
            }
        }, 500);
    }).catch(() => {
        // fallback: still restore UI
        setTimeout(() => {
            if (!wasVisible) {
                receiptView.classList.add('hidden');
                formView.classList.remove('hidden');
            }
        }, 500);
    });
}
