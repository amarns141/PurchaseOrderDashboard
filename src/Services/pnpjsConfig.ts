import { WebPartContext } from '@microsoft/sp-webpart-base';
import { graphfi, GraphFI, SPFx as graphSPFx } from '@pnp/graph';
import { ISPFXContext, spfi, SPFI, SPFx as spSPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

let _sp : SPFI;
let _graph: GraphFI;

export const getSP = (context?: WebPartContext):SPFI =>{
    if(_sp === undefined || _sp === null){

        _sp = spfi().using(spSPFx(context as ISPFXContext));
    }
    return _sp;
};

export const getGraph = (context: WebPartContext): GraphFI =>{
    if(_graph === undefined || _graph === null){

        _graph = graphfi().using(graphSPFx(context as ISPFXContext));
    }
    return _graph;
}