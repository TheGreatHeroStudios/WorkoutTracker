import { BottomNavigation, BottomNavigationAction, Grid, IconButton } from "@mui/material";
import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import { Add, Assignment, FitnessCenter, MonitorWeight, Person, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export type AppShellAction = "Save" | "Add";

export interface AppShellProps
{
    children: ReactNode;
    pageTitle: String;
    pageIndex: number;
    actions?: Map<AppShellAction, () => void>;
    onNavigate?: (prevRoute: string, prevPage: ReactNode) => void;
}

const routeDirectory =
    [
        "../profile",
        "../workouts",
        "../exercises",
        "../weigh-in"
    ];

const iconMap = 
    {
        "Save": Save,
        "Add": Add
    }

const AppShell = (props: AppShellProps) =>
{
    const navigate = useNavigate();
    const [currentPageIndex, setCurrentPageIndex] = useState(props.pageIndex);
    
    return (
        <div>
            <Box 
                width="100vw" 
                height="10vh" 
                sx=
                {{
                    backgroundColor: "#0099FF", 
                    display: "flex", 
                    justifyContent: "center", 
                    color: "white"
                }} >
                    <Grid container>
                        <Grid item xs={8}>
                            <h2 style={{textAlign: "right"}}>{props.pageTitle}</h2>
                        </Grid>
                        <Grid item xs={4} 
                            sx=
                            {{
                                marginTop: "auto", 
                                marginBottom: "auto",
                                display: "flex",
                                justifyContent: "flex-end"
                            }}>
                            {
                                props.actions &&
                                props.actions.size > 0 &&
                                Array
                                    .from(props.actions.entries())
                                    .map
                                    (
                                        (actionTuple) =>
                                        {
                                            const [action, callback] = actionTuple;

                                            if(iconMap[action] !== undefined)
                                            {
                                                return (
                                                    <IconButton onClick={callback} >
                                                        {
                                                            React.createElement
                                                            (
                                                                iconMap[action], 
                                                                {
                                                                    sx: 
                                                                    {
                                                                        color: "white",
                                                                        fontSize: 40
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    </IconButton>
                                                );
                                            }
                                            else
                                            {
                                                return (<></>);
                                            }
                                        }
                                    )
                            }
                        </Grid>
                    </Grid>
            </Box>
            <Box width="100vw" height="80vh" sx={{display: "flex"}}>
                {props.children}
            </Box>
            <BottomNavigation 
                value={currentPageIndex} 
                onChange=
                {
                    (event, value) =>
                    {
                        navigate(routeDirectory[value] ?? routeDirectory[0]);

                        if(props.onNavigate !== null && props.onNavigate !== undefined)
                        {
                            props
                                .onNavigate
                                (
                                    routeDirectory[currentPageIndex] ?? routeDirectory[0], 
                                    props.children
                                );
                        }

                        setCurrentPageIndex(value);
                    }
                }
                sx=
                {{
                    backgroundColor: "#0099FF", 
                    padding: "10px",
                    "& .MuiBottomNavigationAction-root, svg": 
                    {
                        color: "white"
                    },
                    "& .Mui-selected, .Mui-selected > svg": 
                    {
                        color: "#AADDDD"
                    }
                  
                }}
                showLabels >
                <BottomNavigationAction 
                    label="Profile"
                    sx={{fontWeight: "bold"}}
                    icon=
                    {
                        <Person sx={{fontSize: 50}}/>
                    }
                />
                <BottomNavigationAction 
                    label="Workouts"
                    sx={{fontWeight: "bold"}}
                    icon=
                    {
                        <Assignment sx={{fontSize: 50}}/>
                    }
                />
                <BottomNavigationAction 
                    label="Exercises"
                    sx={{fontWeight: "bold"}}
                    icon=
                    {
                        <FitnessCenter sx={{fontSize: 50}}/>
                    }
                />
                <BottomNavigationAction 
                    label="Weigh-In"
                    sx={{fontWeight: "bold"}}
                    icon=
                    {
                        <MonitorWeight sx={{fontSize: 50}}/>
                    }
                />
            </BottomNavigation>
        </div>
    );
};

export default AppShell;