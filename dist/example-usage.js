"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pumpwood = void 0;
/**
 * Exemplos de uso do PumpwoodClient.
 *
 * Em projetos externos: import { PumpwoodClient } from "pumpwood-services";
 */
const index_js_1 = require("./index.js");
// =============================================================================
// CONFIGURAÇÃO — crie o cliente UMA VEZ como singleton
//
// CLIENT-SIDE (browser) — Arquivo: src/lib/pumpwood.ts
// =============================================================================
exports.pumpwood = new index_js_1.PumpwoodClient({
    baseUrl: "http://localhost:8080/rest",
    token: () => localStorage.getItem("auth_token") ?? "",
    //       ↑ factory: reavaliada a cada request, sem precisar recriar o cliente
});
async function referenceExamples() {
    // --- LIST ---
    // Listagem paginada com filtros
    const [areas, listErr] = await exports.pumpwood.list("descriptiongeoarea", {
        filter_dict: { is_active: true },
        order_by: ["-created_at"],
        limit: 20,
        offset: 0,
    });
    if (listErr)
        throw new Error(listErr.message);
    // Listagem SEM paginação — para datasets pequenos (lookups, combos, etc.)
    const [allAreas, listNoPagErr] = await exports.pumpwood.listWithoutPag("descriptiongeoarea", {
        filter_dict: { is_active: true },
        fields: ["pk", "name"],
        order_by: ["name"],
    });
    if (listNoPagErr)
        throw new Error(listNoPagErr.message);
    // --- RETRIEVE ---
    // Busca simples
    const [area, retrieveErr] = await exports.pumpwood.retrieve("descriptiongeoarea", 1);
    if (retrieveErr)
        throw new Error(retrieveErr.message);
    // Busca com relações expandidas — opções tipadas com boolean
    const [areaFull, retrieveFullErr] = await exports.pumpwood.retrieve("descriptiongeoarea", 1, { foreign_key_fields: true, related_fields: true });
    if (retrieveFullErr)
        throw new Error(retrieveFullErr.message);
    // Opções do modelo (field definitions, choices, validation rules)
    const [options, optionsErr] = await exports.pumpwood.retrieveOptions("descriptiongeoarea");
    if (optionsErr)
        throw new Error(optionsErr.message);
    // --- SAVE ---
    // Cria se pk=null, atualiza se pk existe
    const [saved, saveErr] = await exports.pumpwood.save("descriptiongeoarea", {
        pk: null,
        name: "Nova Área",
    });
    if (saveErr)
        throw new Error(saveErr.message);
    // Save retornando relações expandidas
    const [savedFull, saveFullErr] = await exports.pumpwood.save("descriptiongeoarea", { pk: 1, name: "Área Atualizada" }, { foreign_key_fields: true });
    if (saveFullErr)
        throw new Error(saveFullErr.message);
    // --- DELETE ---
    const [, deleteErr] = await exports.pumpwood.delete("descriptiongeoarea", 1);
    if (deleteErr)
        throw new Error(deleteErr.message);
    // --- ACTIONS ---
    // Action em instância (com pk)
    const [, actionErr] = await exports.pumpwood.executeAction({
        modelClass: "MaterialApprovalActivity",
        pk: 123,
        actionName: "review",
        parameters: { new_status: "approved" },
    });
    if (actionErr)
        throw new Error(actionErr.message);
    // Static action (sem instância — pk=0 internamente)
    const [stats, staticActionErr] = await exports.pumpwood.executeStaticAction({
        modelClass: "MaterialApprovalActivity",
        actionName: "get_statistics",
        parameters: { year: 2024 },
    });
    if (staticActionErr)
        throw new Error(staticActionErr.message);
    // --- UPLOAD DE ARQUIVO ---
    const file = new File(["conteúdo"], "data.csv", { type: "text/csv" });
    const [, uploadErr] = await exports.pumpwood.uploadFile("documents", file, { origin: "USER_UPLOAD", format_type: "MELTED" });
    if (uploadErr)
        throw new Error(uploadErr.message);
    // --- DOWNLOAD DE ARQUIVO (retrieve-file) ---
    // ⚠️ Use try/finally para garantir que o URL seja sempre revogado
    const [fileData, fileErr] = await exports.pumpwood.retrieveFile("documents", 42, "file");
    if (fileErr)
        throw new Error(fileErr.message);
    {
        const url = URL.createObjectURL(fileData.blob);
        try {
            window.open(url);
        }
        finally {
            URL.revokeObjectURL(url);
        }
    }
    // --- ACTION QUE RETORNA ARQUIVO (ex: export Excel/PDF) ---
    // Instância com pk
    const [reportFile, reportErr] = await exports.pumpwood.executeActionFile({
        modelClass: "Report",
        pk: 123,
        actionName: "export_excel",
        parameters: { include_charts: true },
    });
    if (reportErr)
        throw new Error(reportErr.message);
    {
        const url = URL.createObjectURL(reportFile.blob);
        try {
            const a = document.createElement("a");
            a.href = url;
            a.download = "report.xlsx";
            a.click();
        }
        finally {
            URL.revokeObjectURL(url); // sempre revogue para evitar memory leak
        }
    }
    // Static action que retorna arquivo (sem instância)
    const [exportFile, exportErr] = await exports.pumpwood.executeStaticActionFile({
        modelClass: "DataExport",
        actionName: "generate_report",
        parameters: { year: 2024, format: "xlsx" },
    });
    if (exportErr)
        throw new Error(exportErr.message);
    {
        const url = URL.createObjectURL(exportFile.blob);
        try {
            const a = document.createElement("a");
            a.href = url;
            a.download = "export.xlsx";
            a.click();
        }
        finally {
            URL.revokeObjectURL(url);
        }
    }
    void areas;
    void allAreas;
    void area;
    void areaFull;
    void options;
    void saved;
    void savedFull;
    void stats;
}
//# sourceMappingURL=example-usage.js.map