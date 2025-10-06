import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx as spSPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

import * as strings from 'PoDashboardWebPartStrings';
import PoDashboard from './components/PoDashboard';
import { IPoDashboardProps } from './components/IPoDashboardProps';

export interface IPoDashboardWebPartProps {
  description: string;
  listsPOTrans: string | string[]; // Stores the list ID(s)
  listPOComment: string | string[]; // Stores the list ID(s)
  listsPOTransArchival: string | string[];
  listsPOTransPending: string | string[];
  poFormUrl : string;
  archivalPODashboardUrl : string;
  newRequestUrl: string;
}

export default class PoDashboardWebPart extends BaseClientSideWebPart<IPoDashboardWebPartProps> {
  private _sp : SPFI;
  private _selectedPOTListId: string;
  private _selectedPOCommentListId: string;
  private _selectedPOTArchivalListId: string;
  private _selectedPOTPendinfListId: string;

  public render(): void {
    const element: React.ReactElement<IPoDashboardProps> = React.createElement(
      PoDashboard,
      {
        sp: this._sp,
        listPOTransListId : this._selectedPOTListId,
        listPOCommentListId : this._selectedPOCommentListId,
        listPOTransArchivalListId: this._selectedPOTArchivalListId,
        listPOTransPendingListId: this._selectedPOTPendinfListId,
        poFormUrl: this.properties.poFormUrl,
        archivalPODashboardUrl: this.properties.archivalPODashboardUrl,
        newRequestUrl: this.properties.newRequestUrl,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {
    await super.onInit();
    this._sp = spfi().using(spSPFx(this.context));
    this._selectedPOTListId = this.properties.listsPOTrans as string;
    this._selectedPOCommentListId = this.properties.listPOComment as string;
    this._selectedPOTArchivalListId = this.properties.listsPOTransArchival as string;
    this._selectedPOTPendinfListId = this.properties.listsPOTransPending as string; 
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  onPropertyPaneFieldChangedPOT(propertyPath:string, oldValue:any, newValue:any) {
    console.log("List Old Value: "+oldValue+" Selected List ID:", newValue);
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if(propertyPath === "lists") {
      this.properties.listsPOTrans = newValue;
      this.render();
    }
  }
  onPropertyPaneFieldChangedPOA(propertyPath:string, oldValue:any, newValue:any) {
    console.log("List Old Value: "+oldValue+" Selected List ID:", newValue);
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if(propertyPath === "lists") {
      this.properties.listsPOTransArchival = newValue;
      this.render();
    }
  }
  onPropertyPaneFieldChangedPOTC(propertyPath:string, oldValue:any, newValue:any) {
    console.log("List Old Value: "+oldValue+" Selected List ID:", newValue);
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if(propertyPath === "lists") {
      this.properties.listPOComment = newValue;
      this.render();
    }
  }
  onPropertyPaneFieldChangedPOP(propertyPath:string, oldValue:any, newValue:any) {
    console.log("List Old Value: "+oldValue+" Selected List ID:", newValue);
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if(propertyPath === "lists") {
      this.properties.listsPOTransPending = newValue;
      this.render();
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('lists', {
                  label: strings.ListFiledLablePOTrans,
                  selectedList: this.properties.listsPOTrans,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChangedPOT.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: (value: string): string => {
                    if (!value) {
                      return 'List selection is required';
                    }
                    return '';
                  },
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('lists', {
                  label: strings.ListFiledLablePOComment,
                  selectedList: this.properties.listPOComment,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChangedPOTC.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: (value: string): string => {
                    if (!value) {
                      return 'List selection is required';
                    }
                    return '';
                  },
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('lists', {
                  label: strings.ListFiledLablePOTransArchival,
                  selectedList: this.properties.listsPOTransArchival,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChangedPOA.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: (value: string): string => {
                    if (!value) {
                      return 'List selection is required';
                    }
                    return '';
                  },
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyFieldListPicker('lists', {
                  label: strings.ListFiledLablePOTransPending,
                  selectedList: this.properties.listsPOTransPending,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChangedPOP.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: (value: string): string => {
                    if (!value) {
                      return 'List selection is required';
                    }
                    return '';
                  },
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyPaneTextField('poFormUrl',{
                    label: strings.POFormUrl
                }),
                PropertyPaneTextField('archivalPODashboardUrl',{
                    label: strings.ArchivalPODashboardUrl
                }),
                PropertyPaneTextField('newRequestUrl',{
                    label: strings.NewPORequest
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
