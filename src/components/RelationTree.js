import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import { Typography } from '@material-ui/core'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { LabelToName, ReverseLabelToName } from "../store/Categories";
import { inject, observer } from "mobx-react";
import repeatedIcon from '../resource/1.png';
import mirroredIcon from '../resource/2.png';
import stackedIcon from '../resource/3.png';
import annotatedIcon from '../resource/4.png';
import accompaniedIcon from '../resource/5.png';
import large_viewIcon from '../resource/6.png';
import coordinatedIcon from '../resource/7.png';
import nestedIcon from '../resource/8.png';

const useStyles = makeStyles((theme) => ({
    root: {

    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        // padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        padding: '0 15px 0 10px',
        // marginRight: theme.spacing(1),
    },
    labelText: {
        fontSize: '1em',
        lineHeight: 4
        // fontWeight: 'inherit',
        // flexGrow: 1,
    },
}));

let nodeId = "1";

const StyledTreeItem = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        // border: '2px solid white',
    },
}))(TreeItem);

const switchIcon = (relation) => {
    switch (relation) {
        case 'repeated':
            return repeatedIcon
        case 'mirrored':
            return mirroredIcon
        case 'stacked':
            return stackedIcon
        case 'large_view':
            return large_viewIcon
        case 'coordinated':
            return coordinatedIcon
        case 'accompanied':
            return accompaniedIcon
        case 'annotated':
            return annotatedIcon
        case 'nested':
            return nestedIcon
        default:
            break;
    }
}


function RelationTree({ relationsTree, d }) {
    const classes = useStyles();

    const handleClick = (rel, isBalanced, relationType) => {
        const balanced = isBalanced || 'balanced';
        const relation = relationType || null;
        d.transformVisualizationsFromRaw(rel, balanced, relation)
    }

    // const checkVisList = (visList) => {
    //     let result = false
    //     visList.forEach(vis => {
    //         if (typeof vis !== 'string') result = true;
    //     })
    //     return result
    // }

    const deleteSameTypeVis = (vislist) => {
        let visType = {};
        return vislist.map(vis => {
            if (typeof vis !== 'string') return vis
            else if (visType[vis.split('-')[0]] === true) {
                return
            } else {
                visType[vis.split('-')[0]] = true;
                return vis
            }
        }).filter(s => {
            return s
        })
    }

    const traverseSubtree = (node) => {
        if (node.vislist.length === 1 && typeof node.vislist[0].vislist !== 'string') {
            const subTree = deleteSameTypeVis(node.vislist[0].vislist)
            return traverseTree(subTree);
        } else if (node.vislist.length === 2) {
            return node.vislist.map((group, index) => {
                const subTree = deleteSameTypeVis(group.vislist)
                return (
                    <StyledTreeItem
                        onClick={() => handleClick(node.vislist[index], 'unbalanced', node.relation)}
                        nodeId={(nodeId += 1)
                        }style={{padding:'0 0 0 70px'}}
                        label={index === 0 ? 'Child' : 'Parent'}
                    >
                        {traverseTree(subTree,true)}
                    </StyledTreeItem>)
            })
        } else if (typeof node.vislist[0].vislist === 'string') {
            return traverseTree(node.vislist[0].vislist);
        }
    }

    const traverseTree = (tree, isBalanced) => {
        return tree.map((node) => {
            return (
                <>
                    {typeof node === "string" ? (
                        <StyledTreeItem style={{padding:isBalanced?'0 0 0 0px':'0 0 0 70px'}} nodeId={(nodeId += 1)} label={LabelToName[node.split('-')[0]]} />
                    ) : (
                        <StyledTreeItem
                            onClick={() => handleClick(node)}
                            nodeId={(nodeId += 1)}
                            label={
                                <div className={classes.labelRoot}>
                                    <img src={switchIcon(node.relation)} color="inherit" className={classes.labelIcon} />
                                    <Typography variant="body2" className={classes.labelText}>
                                        {`${LabelToName[node.relation]} Visualization`}
                                    </Typography>
                                </div>}
                        >
                            {traverseSubtree(node)}
                        </StyledTreeItem>
                    )}
                </>
            );
        });
    };

    return (
        <div>
            <TreeView
                className={classes.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                multiSelect
            >
                {relationsTree && traverseTree(relationsTree)}
            </TreeView>
        </div>
    );
}


export default inject('d')(observer(RelationTree));