/* eslint-disable no-undef */
sap.ui.define(["sap/fe/core/AppComponent"], function (AppComponent) {
  "use strict";

  return AppComponent.extend("dalrae.cap.reuse.base.app.Component", {
    metadata: {
      manifest: {
        _version: "1.32.0",
        "sap.app": {
          id: "dalrae.cap.reuse.base.app.orders",
          type: "application",
          i18n: "i18n/i18n.properties",
          applicationVersion: {
            version: "1.0.0",
          },
          title: "{{appTitle}}",
          description: "{{appDescription}}",
          dataSources: {
            mainService: {
              uri: "/admin/",
              type: "OData",
              settings: {
                odataVersion: "4.0",
              },
            },
          },
          offline: false,
          resources: "resources.json",
          sourceTemplate: {
            id: "ui5template.fiorielements.v4.lrop",
            version: "1.0.0",
          },
        },
        "sap.ui": {
          technology: "UI5",
          icons: {
            icon: "",
            favIcon: "",
            phone: "",
            "phone@2": "",
            tablet: "",
            "tablet@2": "",
          },
          deviceTypes: {
            desktop: true,
            tablet: true,
            phone: true,
          },
        },
        "sap.ui5": {
          resources: {
            js: [],
            css: [],
          },
          dependencies: {
            minUI5Version: "1.76.0",
            libs: {
              "sap.ui.core": {},
              "sap.fe.templates": {},
            },
          },
          models: {
            i18n: {
              type: "sap.ui.model.resource.ResourceModel",
              uri: "i18n/i18n.properties",
            },
            "": {
              dataSource: "mainService",
              preload: true,
              settings: {
                synchronizationMode: "None",
                operationMode: "Server",
                autoExpandSelect: true,
                earlyRequests: true,
              },
            },
          },
          routing: {
            routes: [
              {
                pattern: ":?query:",
                name: "OrdersList",
                target: "OrdersList",
              },
              {
                pattern: "Orders({key}):?query:",
                name: "OrdersObjectPage",
                target: "OrdersObjectPage",
              },
            ],
            targets: {
              OrdersList: {
                type: "Component",
                id: "OrdersList",
                name: "sap.fe.templates.ListReport",
                options: {
                  settings: {
                    entitySet: "Orders",
                    variantManagement: "Page",
                    initialLoad: true,
                    controlConfiguration: {
                      "@com.sap.vocabularies.UI.v1.LineItem": {
                        tableSettings: {
                          type: "ResponsiveTable",
                          selectionMode: "Multi",
                          selectAll: true,
                          enableExport: true,
                          condensedTableLayout: true,
                        },
                      },
                    },
                    navigation: {
                      Orders: {
                        detail: {
                          route: "OrdersObjectPage",
                        },
                      },
                    },
                  },
                },
              },
              OrdersObjectPage: {
                type: "Component",
                id: "OrdersObjectPage",
                name: "sap.fe.templates.ObjectPage",
                options: {
                  settings: {
                    entitySet: "Orders",
                  },
                },
              },
            },
          },
          contentDensities: {
            compact: true,
            cozy: true,
          },
        },
        "sap.platform.abap": {
          _version: "1.1.0",
          uri: "",
        },
        "sap.platform.hcp": {
          _version: "1.1.0",
          uri: "",
        },
        "sap.fiori": {
          _version: "1.1.0",
          registrationIds: [],
          archeType: "transactional",
        },
      },
    },
  });
});
