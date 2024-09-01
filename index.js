import { parse } from './Back/analizador.js';

let tabCount = 0;
let openedTabs = {};

const editor = document.getElementById('codigoFuente')
const cons = document.getElementById('consolaOutput')
document.getElementById('ejecutarBtn').addEventListener('click', analizador);
document.getElementById('crearArchivoBtn').addEventListener('click', crearArchivo);
document.getElementById('abrirArchivoBtn').addEventListener('click', abrirArchivo);
document.getElementById('guardarArchivoBtn').addEventListener('click', guardarArchivo);

function crearArchivo() {
    tabCount++;
    const tabId = `Archivo${tabCount}`;
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.innerText = tabId;
    tab.dataset.tabId = tabId;

    document.querySelector('.tabs').appendChild(tab);
    openedTabs[tabId] = ''; 
    seleccionarTab(tab);
    tab.addEventListener('click', () => seleccionarTab(tab));
}

function abrirArchivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.oak';
    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                tabCount++;
                const tabId = file.name;
                const tab = document.createElement('div');
                tab.className = 'tab';
                tab.innerText = tabId;
                tab.dataset.tabId = tabId;

                document.querySelector('.tabs').appendChild(tab);
                openedTabs[tabId] = content; 
                seleccionarTab(tab);
                tab.addEventListener('click', () => seleccionarTab(tab));
            };
            reader.readAsText(file);
        }
    });

    input.click();
}

function guardarArchivo() {
    const currentTab = document.querySelector('.tab.active');
    if (currentTab) {
        const tabId = currentTab.dataset.tabId;
        const fileContent = document.getElementById('codigoFuente').value;
        
        let fileName = tabId;
        if (!fileName.endsWith('.oak')) {
            fileName += '.oak';
        }

        const blob = new Blob([fileContent], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        openedTabs[tabId] = fileContent;
    } else {
        alert("No hay ninguna pestaña seleccionada para guardar.");
    }
}

function seleccionarTab(tab) {
    const currentTab = document.querySelector('.tab.active');
    if (currentTab) {
        const currentTabId = currentTab.dataset.tabId;
        openedTabs[currentTabId] = document.getElementById('codigoFuente').value;
    }
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const tabId = tab.dataset.tabId;
    document.getElementById('codigoFuente').value = openedTabs[tabId] || '';
}

const recorrer = (nodo) => {
    if (nodo.tipo === 'numero') return nodo.valor
    if (nodo.tipo === 'parentesis') return recorrer(nodo.exp)

    const exp1 = (nodo.izq && recorrer(nodo.izq)) || 0
    const exp2 = recorrer(nodo.der)

    switch (nodo.tipo) {
        case '+': return exp1 + exp2
        case '-': return exp1 - exp2
        case '*': return exp1 * exp2
        case '/': return exp1 / exp2
        case '%': return exp1 % exp2
    }
}

function analizador() {
    const codigoFuente = editor.value;
    const arbol = parse(codigoFuente);
    console.log("AST generado:", JSON.stringify(arbol, null, 2))
    const resultado = recorrer(arbol);
    cons.innerHTML = resultado;
}