import {
  CommonModule
} from "./chunk-EOUKLTLO.js";
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewChild,
  setClassMetadata,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵloadQuery,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵviewQuery
} from "./chunk-ORVS5E3W.js";
import "./chunk-4XYDJY5V.js";
import "./chunk-4VIHZVMQ.js";
import "./chunk-QOGD6RC5.js";
import "./chunk-UGMD5UZ3.js";

// node_modules/ng2-pdfjs-viewer/fesm2022/ng2-pdfjs-viewer.mjs
var _c0 = ["iframe"];
var PdfJsViewerComponent = class _PdfJsViewerComponent {
  iframe;
  static lastID = 0;
  viewerId = `ng2-pdfjs-viewer-ID${++_PdfJsViewerComponent.lastID}`;
  onBeforePrint = new EventEmitter();
  onAfterPrint = new EventEmitter();
  onDocumentLoad = new EventEmitter();
  onPageChange = new EventEmitter();
  viewerFolder;
  externalWindow = false;
  target = "_blank";
  showSpinner = true;
  downloadFileName;
  openFile = true;
  download = true;
  startDownload;
  viewBookmark = true;
  print = true;
  startPrint;
  fullScreen = true;
  //@Input() public showFullScreen: boolean;
  find = true;
  zoom;
  nameddest;
  pagemode;
  lastPage;
  rotatecw;
  rotateccw;
  cursor;
  scroll;
  spread;
  locale;
  useOnlyCssZoom = false;
  errorOverride = false;
  errorAppend = true;
  errorMessage;
  diagnosticLogs = true;
  externalWindowOptions;
  viewerTab;
  _src;
  _page;
  set page(_page) {
    this._page = _page;
    if (this.PDFViewerApplication) {
      this.PDFViewerApplication.page = this._page;
    } else {
      if (this.diagnosticLogs)
        console.warn("Document is not loaded yet!!!. Try to set page# after full load. Ignore this warning if you are not setting page# using '.' notation. (E.g. pdfViewer.page = 5;)");
    }
  }
  get page() {
    if (this.PDFViewerApplication) {
      return this.PDFViewerApplication.page;
    } else {
      if (this.diagnosticLogs)
        console.warn("Document is not loaded yet!!!. Try to retrieve page# after full load.");
    }
  }
  set pdfSrc(_src) {
    this._src = _src;
  }
  get pdfSrc() {
    return this._src;
  }
  get PDFViewerApplicationOptions() {
    let pdfViewerOptions = null;
    if (this.externalWindow) {
      if (this.viewerTab) {
        pdfViewerOptions = this.viewerTab.PDFViewerApplicationOptions;
      }
    } else {
      if (this.iframe.nativeElement.contentWindow) {
        pdfViewerOptions = this.iframe.nativeElement.contentWindow.PDFViewerApplicationOptions;
      }
    }
    return pdfViewerOptions;
  }
  get PDFViewerApplication() {
    let pdfViewer = null;
    if (this.externalWindow) {
      if (this.viewerTab) {
        pdfViewer = this.viewerTab.PDFViewerApplication;
      }
    } else {
      if (this.iframe.nativeElement.contentWindow) {
        pdfViewer = this.iframe.nativeElement.contentWindow.PDFViewerApplication;
      }
    }
    return pdfViewer;
  }
  receiveMessage(viewerEvent) {
    if (viewerEvent.data && viewerEvent.data.viewerId && viewerEvent.data.event) {
      let viewerId = viewerEvent.data.viewerId;
      let event = viewerEvent.data.event;
      let param = viewerEvent.data.param;
      if (this.viewerId == viewerId) {
        if (this.onBeforePrint && event == "beforePrint") {
          this.onBeforePrint.emit();
        } else if (this.onAfterPrint && event == "afterPrint") {
          this.onAfterPrint.emit();
        } else if (this.onDocumentLoad && event == "pagesLoaded") {
          this.onDocumentLoad.emit(param);
        } else if (this.onPageChange && event == "pageChange") {
          this.onPageChange.emit(param);
        }
      }
    }
  }
  ngOnInit() {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
    if (!this.externalWindow) {
      this.loadPdf();
    }
  }
  refresh() {
    this.loadPdf();
  }
  relaseUrl;
  // Avoid memory leask with `URL.createObjectURL`
  loadPdf() {
    if (!this._src) {
      return;
    }
    if (this.externalWindow && (typeof this.viewerTab === "undefined" || this.viewerTab.closed)) {
      this.viewerTab = window.open("", this.target, this.externalWindowOptions || "");
      if (this.viewerTab == null) {
        if (this.diagnosticLogs)
          console.error("ng2-pdfjs-viewer: For 'externalWindow = true'. i.e opening in new tab to work, pop-ups should be enabled.");
        return;
      }
      if (this.showSpinner) {
        this.viewerTab.document.write(`
          <style>
          .loader {
            position: fixed;
            left: 40%;
            top: 40%;
            border: 16px solid #f3f3f3;
            border-radius: 50%;
            border-top: 16px solid #3498db;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          </style>
          <div class="loader"></div>
        `);
      }
    }
    this.relaseUrl?.();
    let fileUrl;
    if (this._src instanceof Blob) {
      const url = URL.createObjectURL(this._src);
      fileUrl = encodeURIComponent(url);
      this.relaseUrl = () => URL.revokeObjectURL(url);
    } else if (this._src instanceof Uint8Array) {
      let blob = new Blob([this._src], {
        type: "application/pdf"
      });
      const url = URL.createObjectURL(blob);
      this.relaseUrl = () => URL.revokeObjectURL(url);
      fileUrl = encodeURIComponent(url);
    } else {
      fileUrl = this._src;
    }
    let viewerUrl;
    if (this.viewerFolder) {
      viewerUrl = `${this.viewerFolder}/web/viewer.html`;
    } else {
      viewerUrl = `assets/pdfjs/web/viewer.html`;
    }
    viewerUrl += `?file=${fileUrl}`;
    if (typeof this.viewerId !== "undefined") {
      viewerUrl += `&viewerId=${this.viewerId}`;
    }
    if (typeof this.onBeforePrint !== "undefined") {
      viewerUrl += `&beforePrint=true`;
    }
    if (typeof this.onAfterPrint !== "undefined") {
      viewerUrl += `&afterPrint=true`;
    }
    if (typeof this.onDocumentLoad !== "undefined") {
      viewerUrl += `&pagesLoaded=true`;
    }
    if (typeof this.onPageChange !== "undefined") {
      viewerUrl += `&pageChange=true`;
    }
    if (this.downloadFileName) {
      if (!this.downloadFileName.endsWith(".pdf")) {
        this.downloadFileName += ".pdf";
      }
      viewerUrl += `&fileName=${this.downloadFileName}`;
    }
    if (typeof this.openFile !== "undefined") {
      viewerUrl += `&openFile=${this.openFile}`;
    }
    if (typeof this.download !== "undefined") {
      viewerUrl += `&download=${this.download}`;
    }
    if (this.startDownload) {
      viewerUrl += `&startDownload=${this.startDownload}`;
    }
    if (typeof this.viewBookmark !== "undefined") {
      viewerUrl += `&viewBookmark=${this.viewBookmark}`;
    }
    if (typeof this.print !== "undefined") {
      viewerUrl += `&print=${this.print}`;
    }
    if (this.startPrint) {
      viewerUrl += `&startPrint=${this.startPrint}`;
    }
    if (typeof this.fullScreen !== "undefined") {
      viewerUrl += `&fullScreen=${this.fullScreen}`;
    }
    if (typeof this.find !== "undefined") {
      viewerUrl += `&find=${this.find}`;
    }
    if (this.lastPage) {
      viewerUrl += `&lastpage=${this.lastPage}`;
    }
    if (this.rotatecw) {
      viewerUrl += `&rotatecw=${this.rotatecw}`;
    }
    if (this.rotateccw) {
      viewerUrl += `&rotateccw=${this.rotateccw}`;
    }
    if (this.cursor) {
      viewerUrl += `&cursor=${this.cursor}`;
    }
    if (this.scroll) {
      viewerUrl += `&scroll=${this.scroll}`;
    }
    if (this.spread) {
      viewerUrl += `&spread=${this.spread}`;
    }
    if (this.locale) {
      viewerUrl += `&locale=${this.locale}`;
    }
    if (this.useOnlyCssZoom) {
      viewerUrl += `&useOnlyCssZoom=${this.useOnlyCssZoom}`;
    }
    if (this._page || this.zoom || this.nameddest || this.pagemode)
      viewerUrl += "#";
    if (this._page) {
      viewerUrl += `&page=${this._page}`;
    }
    if (this.zoom) {
      viewerUrl += `&zoom=${this.zoom}`;
    }
    if (this.nameddest) {
      viewerUrl += `&nameddest=${this.nameddest}`;
    }
    if (this.pagemode) {
      viewerUrl += `&pagemode=${this.pagemode}`;
    }
    if (this.errorOverride || this.errorAppend) {
      viewerUrl += `&errorMessage=${this.errorMessage}`;
      if (this.errorOverride) {
        viewerUrl += `&errorOverride=${this.errorOverride}`;
      }
      if (this.errorAppend) {
        viewerUrl += `&errorAppend=${this.errorAppend}`;
      }
    }
    if (this.externalWindow) {
      this.viewerTab.location.href = viewerUrl;
    } else {
      this.iframe.nativeElement.src = viewerUrl;
    }
  }
  ngOnDestroy() {
    this.relaseUrl?.();
  }
  static ɵfac = function PdfJsViewerComponent_Factory(t) {
    return new (t || _PdfJsViewerComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _PdfJsViewerComponent,
    selectors: [["ng2-pdfjs-viewer"]],
    viewQuery: function PdfJsViewerComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c0, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.iframe = _t.first);
      }
    },
    inputs: {
      viewerId: "viewerId",
      viewerFolder: "viewerFolder",
      externalWindow: "externalWindow",
      target: "target",
      showSpinner: "showSpinner",
      downloadFileName: "downloadFileName",
      openFile: "openFile",
      download: "download",
      startDownload: "startDownload",
      viewBookmark: "viewBookmark",
      print: "print",
      startPrint: "startPrint",
      fullScreen: "fullScreen",
      find: "find",
      zoom: "zoom",
      nameddest: "nameddest",
      pagemode: "pagemode",
      lastPage: "lastPage",
      rotatecw: "rotatecw",
      rotateccw: "rotateccw",
      cursor: "cursor",
      scroll: "scroll",
      spread: "spread",
      locale: "locale",
      useOnlyCssZoom: "useOnlyCssZoom",
      errorOverride: "errorOverride",
      errorAppend: "errorAppend",
      errorMessage: "errorMessage",
      diagnosticLogs: "diagnosticLogs",
      externalWindowOptions: "externalWindowOptions",
      page: "page",
      pdfSrc: "pdfSrc"
    },
    outputs: {
      onBeforePrint: "onBeforePrint",
      onAfterPrint: "onAfterPrint",
      onDocumentLoad: "onDocumentLoad",
      onPageChange: "onPageChange"
    },
    decls: 2,
    vars: 1,
    consts: [["iframe", ""], ["title", "ng2-pdfjs-viewer", "width", "100%", "height", "100%", 3, "hidden"]],
    template: function PdfJsViewerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelement(0, "iframe", 1, 0);
      }
      if (rf & 2) {
        ɵɵproperty("hidden", ctx.externalWindow || !ctx.externalWindow && !ctx.pdfSrc);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PdfJsViewerComponent, [{
    type: Component,
    args: [{
      selector: "ng2-pdfjs-viewer",
      template: `<iframe title="ng2-pdfjs-viewer" [hidden]="externalWindow || (!externalWindow && !pdfSrc)" #iframe width="100%" height="100%"></iframe>`
    }]
  }], null, {
    iframe: [{
      type: ViewChild,
      args: ["iframe", {
        static: true
      }]
    }],
    viewerId: [{
      type: Input
    }],
    onBeforePrint: [{
      type: Output
    }],
    onAfterPrint: [{
      type: Output
    }],
    onDocumentLoad: [{
      type: Output
    }],
    onPageChange: [{
      type: Output
    }],
    viewerFolder: [{
      type: Input
    }],
    externalWindow: [{
      type: Input
    }],
    target: [{
      type: Input
    }],
    showSpinner: [{
      type: Input
    }],
    downloadFileName: [{
      type: Input
    }],
    openFile: [{
      type: Input
    }],
    download: [{
      type: Input
    }],
    startDownload: [{
      type: Input
    }],
    viewBookmark: [{
      type: Input
    }],
    print: [{
      type: Input
    }],
    startPrint: [{
      type: Input
    }],
    fullScreen: [{
      type: Input
    }],
    find: [{
      type: Input
    }],
    zoom: [{
      type: Input
    }],
    nameddest: [{
      type: Input
    }],
    pagemode: [{
      type: Input
    }],
    lastPage: [{
      type: Input
    }],
    rotatecw: [{
      type: Input
    }],
    rotateccw: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    scroll: [{
      type: Input
    }],
    spread: [{
      type: Input
    }],
    locale: [{
      type: Input
    }],
    useOnlyCssZoom: [{
      type: Input
    }],
    errorOverride: [{
      type: Input
    }],
    errorAppend: [{
      type: Input
    }],
    errorMessage: [{
      type: Input
    }],
    diagnosticLogs: [{
      type: Input
    }],
    externalWindowOptions: [{
      type: Input
    }],
    page: [{
      type: Input
    }],
    pdfSrc: [{
      type: Input
    }]
  });
})();
var PdfJsViewerModule = class _PdfJsViewerModule {
  static forRoot() {
    return {
      ngModule: _PdfJsViewerModule
    };
  }
  static ɵfac = function PdfJsViewerModule_Factory(t) {
    return new (t || _PdfJsViewerModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _PdfJsViewerModule,
    declarations: [PdfJsViewerComponent],
    imports: [CommonModule],
    exports: [PdfJsViewerComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [CommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PdfJsViewerModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [PdfJsViewerComponent],
      exports: [PdfJsViewerComponent]
    }]
  }], null, null);
})();
export {
  PdfJsViewerComponent,
  PdfJsViewerModule
};
//# sourceMappingURL=ng2-pdfjs-viewer.js.map
