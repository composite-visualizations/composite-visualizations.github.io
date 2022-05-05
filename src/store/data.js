import { makeObservable, action, computed, observable } from "mobx";
import authorsData from '../resource/authors.json';
import compositeVisInfoUnordered from '../resource/composite_vis_info_full.json'
import { ColorStyles} from "./Categories";



const compositeVisInfo = Object.keys(compositeVisInfoUnordered).sort().reduce(
    (obj, key) => { 
      obj[key] = compositeVisInfoUnordered[key]; 
      return obj;
    }, 
    {}
  );

function filterImages(state){
    // keys: compType, authors, conference, filterBarState??, filterType, searchState, searchWords, visType, years

    let imgList = []

    const years = state.years
    const compType = Object.keys(state.compType).filter(key => state.compType[key] === true);
    const authors = Object.keys(state.authors).filter(key => state.authors[key] === true);
    const conference = Object.keys(state.conference).filter(key => state.conference[key] === true);
    const visType = Object.keys(state.visType).filter(key => state.visType[key] === true);
    const filterType = state.filterType
    const searchState = state.searchState

    let searchWords = state.searchWords.toLowerCase()
    searchWords = searchWords==''? []:searchWords.split(' ')


    Object.keys(compositeVisInfo).forEach(itemKey => {
        const itemValue = compositeVisInfo[itemKey]
        let fulfilled = itemValue.year >= years[0] && itemValue.year <= years[1]
        
        if (fulfilled && searchWords.length > 0){
            let allWords = []
            for(const [wordKey, wordValue] of Object.entries(searchState)){
                if (wordValue == true){ // or
                    allWords = [...allWords, ...itemValue[wordKey].toLowerCase().split(' ')]
                }
            }
            fulfilled = checkInclude(allWords, searchWords, 'and')
        }

        if (fulfilled && compType.length > 0){
            fulfilled = checkInclude(itemValue.compType, compType, filterType.compType)
        }
        if (fulfilled && authors.length > 0){
            fulfilled = checkInclude(itemValue.authors, authors, filterType.authors)
        }
        if (fulfilled && conference.length > 0){
            fulfilled = checkInclude(itemValue.conference, conference, filterType.conference)
        }
        if (fulfilled && visType.length > 0){
            fulfilled = checkInclude(itemValue.visType, visType, filterType.visType)
        }

        if (fulfilled) imgList.push(itemKey)
    })

    return imgList
}

function checkName(){}

function checkInclude(values, conditions, logic){
    if (logic == 'and'){
        for (const c of conditions){
            if (values.indexOf(c) == -1) return false
        }
        return true
    }
    else if (logic == 'or'){
        for (const c of conditions){
            if (values.indexOf(c) > -1) return true
        }
        return false
    }
}

class Data {
    constructor(root) {
        makeObservable(this);
        this.root = root;
    }

    init() {
        this.resetFilterState();
        this.resetImgState();
        this.updateFilteredImagesData();
    }

    @observable.shallow authorsList = authorsData;//database for filtering author



    @observable.deep dataState = {
        // balanced: false,//heatmap show host/client or not
        selectGalleryImg: false,//show VISImage View or not
        overviewState: 'coOccurrence',
        overviewDetailState: false,
        matrixColor: '#e46366'
    }
    @observable filteredImagesData = {};//a subdataset of imagesData after filtering
    // @observable filteredImagesData = imagesData;//a subdataset of imagesData after filtering
    @observable imgList = [];//list of images' filename

    @observable zoomInState = {
        activate: false,
        levelName: null,
        client: null,
        host: null
    }
    @observable zoomInImgList = [];//list of images' filename

    @observable coOccurrenceData = {};
    // @observable searchWords = null;
    @observable.deep filterState = {}
    @observable imagesYearList = {};//data for timeline view
    @observable filteredVisType = {};
    // @observable filteredClientVisType = {};
    // @observable filteredHostVisType = {};
    @observable detailsBar = {}
    // @observable focusVisType = null;
    @observable imgState = {};
    @observable heatmapData = {};
    @observable heatmapViewData = [];
    @observable indexToClient = {};//map heatmap index data to visType
    @observable indexToHost = {};
    @observable detailsBarData = [];
    @observable searchedAuthorsList = Object.keys(authorsData);
    @observable highlightIndexList = []




    @action resetImgState = () => {//data for VISImage view
        this.imgState = {
            imgId: null,
            caption: null,
            abstract: null,
            visType: null,
            compType: null,
            title: null,
            authors: null,
            year: null,
            conference: null,
            img_size: null,
            subfigure: null,
            galleryScale: 1,
            viewDimension: {
                width: 1,
                height: 1
            },
            imgSize: {
                width: 1,
                height: 1
            }
        }
    }

    @action resetImagesYearList = () => (
        this.imagesYearList = {
            2006: 0,
            2007: 0,
            2008: 0,
            2009: 0,
            2010: 0,
            2011: 0,
            2012: 0,
            2013: 0,
            2014: 0,
            2015: 0,
            2016: 0,
            2017: 0,
            2018: 0,
            2019: 0,
            2020: 0,
        });


    @action resetFilterState = () => {
        this.filterState = {
            compType: {//compositionType
                repeated: false,
                stacked: false,
                mirrored: false,
                large_view: false,
                annotated: false,
                coordinated: false,
                accompanied: false,
                nested: false,
                // coOccurrence: false,
            },
            visType: {//visualizationType
                arc_diagram: false,
                area_chart: false,
                bar_chart: false,
                box_plot: false,
                comb: false,
                contour_graph: false,
                chord_diagram: false,
                donut_chart: false,
                error_bar: false,
                flow_diagram: false,
                glyph_based: false,
                graph: false,
                heatmap: false,
                line_chart: false,
                matrix: false,
                map: false,
                others: false,
                parallel_coordinate: false,
                pie_chart: false,
                polar_plot: false,
                proportional_area_chart: false,
                sankey_diagram: false,
                scatterplot: false,
                scivis: false,
                sector_chart: false,
                small_multiple: false,
                storyline: false,
                stripe_graph: false,
                sunburst_icicle: false,
                surface_graph: false,
                table: false,
                tree: false,
                treemap: false,
                unit_visualization: false,
                vector_graph: false,
                word_cloud: false,
            },
            conference: {
                InfoVis: false,
                VAST: false,
                SciVis: false,
                Vis: false,
            },
            authors: this.authorsList,
            years: [2006, 2020],
            searchWords: "",
            filterBarState: {
                compType: 'All',
                visType: 'All',
                conference: 'All',
                authors: 'All',
                searchState: 'Search All'
            },
            filterType: {
                visType: 'or',
                compType: 'and',
                conference: 'or',
                authors: 'or',
            },
            searchState: {
                keywords: true,
                title: true,
                abstract: true,
                // caption: true,
            },
        }
    }

    @action resetFilteredVisType = () => {
        this.filteredVisType = {};
        // this.filteredClientVisType = {};
        // this.filteredHostVisType = {};
    }

    @action resetHeatmapData = () => {
        this.heatmapData = {};
        Object.keys(this.filteredVisType).forEach(client => {
            this.heatmapData[client] = {}
            Object.keys(this.filteredVisType).forEach(host => {
                this.heatmapData[client][host] = [];
            })
        })
    }

    @action resetDetailsBar = () => {
        this.detailsBar = {
            show: false,
            type: null,
            visType: null,
            select: null,
        }
    }

    //get gallery images' name list
    @action updateImgList = (client, host) => {
        client = client || null;
        host = host || null;
        if (this.dataState.selectGalleryImg) this.closeSelectedImgState();
        let imgList = this.heatmapData;
        if (client !== null && host !== null) {
            imgList = imgList[client][host]
        } else if (client !== null && host === null) {
            imgList = imgList[client]
        } else if (client === null && host !== null) {
            let hostResult = {}
            Object.keys(this.heatmapData).forEach((nowClient, idx) => {
                Object.keys(this.heatmapData[nowClient]).forEach(nowHost => {
                    if (nowHost !== host) return;
                    if (!(nowHost in hostResult)) hostResult[nowHost] = []
                    hostResult[nowHost] = [...hostResult[nowHost], ...this.heatmapData[nowClient][nowHost]]
                })
            })
            imgList = hostResult
        }

        if (client === null || host === null) {//use heatmap View's Typebar
            let newImgList = [];
            Object.keys(imgList).forEach(imgId => {
                newImgList = newImgList.concat(imgList[imgId])
            })
            imgList = Array.from(new Set(newImgList))
        }
        this.zoomInImgList = Array.from(new Set(imgList));
        this.zoomInState = {
            activate: true,
            levelName: this.dataState.overviewDetailState === false? this.dataState.overviewState: this.dataState.overviewDetailState,
            client: client,
            host: host
        }
    }

    @action updateSearchWords = (value) => {
        this.filterState.searchWords = value;
    }

    @action updateFilteredImagesData = () => {
        this.searchRequest(this.filterState);
    }

    @action searchRequest = (state) => {
        this.imgList = filterImages(state)
        this.updateImagesYearList();
        this.updateHeatmapData();
    }

    @action getImgDetails = (img_id) => {
        this.loadData(compositeVisInfo[img_id]);
        this.transformDataFromRaw();
    }

    @action loadData = (data) => {
        this.imgState.visType = data['visType']
        this.imgState.compType = data['compType']
        this.imgState.authors = data['authors']
        this.imgState.caption = data['caption']
        this.imgState.abstract = data['abstract']
        this.imgState.conference = data['conference']
        this.imgState.year = data['year']
        this.imgState.title = data['title']
        this.imgState.doi = data['doi']
        this.imgState.subfiguresRaw = data['subfigures']
        this.imgState.visualizationsRaw = data['visualizations']
        this.imgState.relationsRaw = data['relations']
        this.transformRelationsFromRaw();
    }

    getImageSize = (imgId) => {
        return compositeVisInfo[imgId].img_size
    }

    //update timeLine view's data
    @action updateImagesYearList = () => {
        this.resetImagesYearList();
        this.imgList.forEach(key => {
            this.imagesYearList[compositeVisInfo[key]['year']] += 1;
        })
        this.updateFilteredVisType();
    }

    //update heatmap view's data
    @action updateHeatmapData = () => {
        this.resetHeatmapData();
        this.resetDetailsBar();
        this.patternCnt = 0;
        const juxtaposed = ['repeated', 'stacked', 'mirrored']
        const overlaid = ['large_view', 'annotated', 'coordinated', 'accompanied']
        const nested = ['nested']
        const coOccurrence = ['coOccurrence']
        if (document.getElementById('heatmap_wrap'))
            document.getElementById('heatmap_wrap').style.height = '90%';
        if (this.dataState.overviewState === 'coOccurrence') {
            this.imgList.forEach(imgId => {
                compositeVisInfo[imgId].coOccurrence.forEach(arr => {
                    if(arr[0] in this.filteredVisType && arr[1] in this.filteredVisType){
                        this.heatmapData[arr[0]][arr[1]].push(imgId)
                    }
                })
            })
        } else {
            this.imgList.forEach(imgId => {
                compositeVisInfo[imgId].comp.forEach(arr => {
                    const intersectionLen = (arr1, arr2) => {
                        return arr1.filter(compType => arr2.indexOf(compType) > -1).length
                    }

                    //overview filter
                    if (this.dataState.overviewDetailState !== false) {
                        if (intersectionLen([this.dataState.overviewDetailState], arr[2]) === 0) {
                            return
                        }
                    } else {
                        if (this.dataState.overviewState === 'juxtaposed' && intersectionLen(juxtaposed, arr[2]) === 0) {
                            return
                        } else if (this.dataState.overviewState === 'overlaid' && intersectionLen(overlaid, arr[2]) === 0) {
                            return
                        } else if (this.dataState.overviewState === 'nested' && intersectionLen(nested, arr[2]) === 0) {
                            return
                        }
                    }

                    this.heatmapData[arr[0]][arr[1]].push(imgId)
                })
            })
        }

        Object.keys(this.heatmapData).forEach(client => {
            Object.keys(this.heatmapData[client]).forEach(host => {
                this.heatmapData[client][host] = Array.from(new Set(this.heatmapData[client][host]))
            })
        })
        this.updateHeatmapViewData();
    }

    //transform heatmapData to apply to echarts
    @action updateHeatmapViewData = () => {
        this.heatmapViewData = [];
        this.indexToClient = {};
        this.indexToHost = {};
        Object.keys(this.heatmapData).forEach((client, cidx) => {
            this.indexToClient[cidx] = client;
            this.heatmapViewData = this.heatmapViewData.concat(Object.keys(this.heatmapData[client]).map((host, hidx) => {
                this.indexToHost[hidx] = host;
                return [cidx, hidx, this.heatmapData[client][host].length];
            }))
        });
    }

    @action updateDetailsBarData = () => {
        this.detailsBarData = [];
        this.heatmapViewData.forEach(arr => {
            const cidx = arr[0];
            const hidx = arr[1];
            const num = arr[2];
            if (!this.detailsBar.show) return;
            if (this.detailsBar.type === 'Child' && this.indexToClient[cidx] === this.detailsBar.visType) {
                this.detailsBarData.push({ num: num, idx: hidx });
            } else if (this.detailsBar.type === 'Parent' && this.indexToHost[hidx] === this.detailsBar.visType) {
                this.detailsBarData.push({ num: num, idx: cidx });
            }
        })
        this.detailsBarData.sort((value1, value2) => {
            if (value1.num > value2.num) return 1;
            else if (value2.num > value1.num) return -1;
            else return 0;
        });
    }

    @action updateFilteredVisType = () => {
        this.resetFilteredVisType();
        if(this.dataState.overviewState === 'coOccurrence'){
            this.imgList.forEach(imgId =>{
                compositeVisInfo[imgId].comp.forEach(comp => {
                    const client = comp[0];
                    const host = comp[1];
                    [client, host].forEach(visType => {
                        if (!(visType in this.filteredVisType)) this.filteredVisType[visType] = 0
                        this.filteredVisType[visType] += 1;
                    })
                })
            })
        }
        else{
            this.imgList.forEach(imgId => {
                compositeVisInfo[imgId].comp.forEach(comp => {
                    const client = comp[0];
                    const host = comp[1];
                    [client, host].forEach(visType => {
                        if (!(visType in this.filteredVisType)) this.filteredVisType[visType] = 0
                        this.filteredVisType[visType] += 1;
                        // }
                    })

                })
            })
        }
        //sort
        let tempObject = {}
        Object.keys(this.filteredVisType).sort().forEach(visType => {
            tempObject[visType] = this.filteredVisType[visType];
        })
        this.filteredVisType = tempObject;
    }

    //change filterCard State and displayeds sentence
    @action changeFilterState = (type, value) => {
        if (value === 'All' && this.filterStateSelected(type) !== Object.keys(this.filterState[type]).length) {
            Object.keys(this.filterState[type]).forEach((key) => {
                this.filterState[type][key] = true;
            })
        } else if (value === 'All') {
            Object.keys(this.filterState[type]).forEach((key) => {
                this.filterState[type][key] = false;
            })
        } else if (value !== 'All') {
            this.filterState[type][value] = !this.filterState[type][value];
        }
        if (this.filterStateSelected(type) === Object.keys(this.filterState[type]).length)
            this.filterState.filterBarState[type] = 'All';
        else {
            const searchExpress = 'Part';
            this.filterState.filterBarState[type] = `${searchExpress}`;
        }
        if (type === 'searchState') this.filterState.filterBarState[type] = `Search ${this.filterState.filterBarState[type]}`;
        this.updateFilteredImagesData();
        this.updateImagesYearList();
        this.updateHeatmapData();
    }

    //count true in filterState
    @action filterStateSelected = (type) => {
        let totalSelected = 0;
        Object.keys(this.filterState[type]).forEach((key) => {
            if (this.filterState.filterType.compType === 'or' && key === 'coOccurrence') {
                totalSelected += 1;
            } else if (this.filterState[type][key]) {
                totalSelected += 1;
            }
        })
        return totalSelected;
    }

    //change the start year and the end year of timeLine
    @action changeFilterYears = (event, newYears) => {
        this.filterState.years = newYears;
    }

    @action changeFilterYearsCommit = () => {
        this.updateFilteredImagesData();
        this.updateImagesYearList();
        this.updateHeatmapData();
    }

    @action changeFocusVisType = () => {

    }

    @action transformDataFromRaw = () => {
        const img = this.imgState.imgId.split('.')[0];
        const dimensions = this.imgState.viewDimension;
        const imgSize = this.imgState.imgSize;
        ['img_size'].forEach(key => {
            this.imgState[key] = compositeVisInfo[img].img_size[key]
        })
        this.imgState.subfigures = this.imgState.subfiguresRaw.map((raw, i) => {
            const numId = parseInt(raw.id.replace(raw.type + "-", ""));
            return {
                x: (raw.x) / imgSize.width * dimensions.width,
                y: (raw.y) / imgSize.height * dimensions.height,
                width: (raw.width) / imgSize.width * dimensions.width,
                height: (raw.height) / imgSize.height * dimensions.height,
                stroke: '#000000',
                opacity: '0.5',
                dash: [50, 15],
                dashEnable: true,
                strokeWidth: 5,
                id: raw.id,
                numId: numId,
                type: raw.type,
            }
        });
    }

    @action transformVisualizationsFromRaw = (rel, isBalanced, getRelationType) => {
        let balanced = isBalanced || 'balanced';
        let relationType = rel.relation || getRelationType;
        const dimensions = this.imgState.viewDimension;
        const imgSize = this.imgState.imgSize;
        let tempList = []
        const traverseRelation = (relation, visList) => {
            if (typeof (relation) === 'string') {
                visList.push(relation)
            } else if (balanced === 'balanced') {
                relation.vislist.forEach(groups => {
                    groups.vislist.forEach(relList => {
                        visList = traverseRelation(relList, visList)
                    })
                })
            } else {
                balanced = 'balanced';
                relation.vislist.forEach(relList => {
                    visList = traverseRelation(relList, visList)
                })
            }
            return visList
        }
        const visList = traverseRelation(rel, tempList);
        let x, y, x2, y2, flag = false;
        this.imgState.visualizationsRaw.forEach((raw, i) => {
            if (visList.indexOf(raw.id) > -1) {
                if (flag === false) {
                    x = raw.x;
                    y = raw.y;
                    x2 = raw.x + raw.width;
                    y2 = raw.y + raw.height;
                    flag = true;
                } else {
                    x2 = Math.max(x2, raw.x + raw.width)
                    y2 = Math.max(y2, raw.y + raw.height)
                    x = Math.min(x, raw.x)
                    y = Math.min(y, raw.y)
                }
            }
        })
        this.imgState.visualizations = [{
            x: (x) / imgSize.width * dimensions.width,
            y: (y) / imgSize.height * dimensions.height,
            width: (x2 - x) / imgSize.width * dimensions.width,
            height: (y2 - y) / imgSize.height * dimensions.height,
            stroke: ColorStyles[relationType],
            strokeWidth: 5,
            id: 'vis',
            numId: 0,
            type: 'type',
        }]

    }

    @action transformRelationsFromRaw = () => {
        this.imgState.relations = this.imgState.relationsRaw.map(relation => {
            return relation
        })
    }

    //render when select a image in gallery
    @action activeSelectedImgState = (imgId) => {
        this.dataState.selectGalleryImg = true;
        if (imgId !== this.imgState.imgId) {
            this.imgState.subfigures = null;
            this.imgState.visualizations = null;
        }
        this.imgState.imgId = imgId;
    }

    //close VISImage View
    @action closeSelectedImgState = () => {
        this.dataState.selectGalleryImg = false;
        this.resetImgState();
        document.getElementById('gallery_wrap').style.width = '99%'
    }

    //turn to other VISImage view
    @action changeImgId = (value) => {
        const index = this.imgList.indexOf(this.imgState.imgId);
        const nextIndex = value + index;
        if (nextIndex < 0 || nextIndex >= this.imgList.length) return
        this.imgState.imgId = this.imgList[index + value];
        this.imgState.subfigures = null;
        this.imgState.visualizations = null;
        this.activeSelectedImgState(this.imgState.imgId)
    }

    @action changeFilterType = (type, value) => {
        if (value !== this.filterState.filterType[type]) {
            this.filterState.filterType[type] = value;
            // if (value === 'and' && Object.keys(this.filterState[type]).length === this.filterStateSelected(type)
            //     || (value === 'or' && this.filterStateSelected(type) === 0)) {
            //     Object.keys(this.filterState[type]).forEach(key => {
            //         // if(key === 'coOccurrence')return
            //         this.filterState[type][key] = !this.filterState[type][key];
            //     })
            // }
            this.updateFilteredImagesData();
            this.updateImagesYearList();
            this.updateHeatmapData();
        }
    }

    @action changeOverviewState = (value) => {
        const mapColor = {
            coOccurrence: '#e46366',
            juxtaposed: '#1f77b4',
            overlaid: '#ef8536',
            nested: '#519c3e'
        }
        this.dataState.overviewState = value;
        this.dataState.matrixColor = mapColor[value];
        this.updateFilteredVisType();
        this.updateHeatmapData();
    }

    @action updateSearchAuthors = (value) => {
        this.searchedAuthorsList = Object.keys(this.authorsList).map(author => {
            if (author.toLowerCase().indexOf(value.toLowerCase()) >= 0) return author
        }).filter(s => {
            return s && s.trim();
        })
        console.log(this.searchedAuthorsList)
    }

    @action countPatterns = () => {
        let cnt = 0;
        this.imgList.forEach(imgId => {
            this.filteredImagesData[imgId].comp.forEach(comp => {
                if (comp[2].indexOf('coOccurrence') > -1) {
                    cnt += comp[2].length - 1;
                } else {
                    cnt += comp[2].length;
                }
            })
        })
        return cnt
    }

}

export default Data;