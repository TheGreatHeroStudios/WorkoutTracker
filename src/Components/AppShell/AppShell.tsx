import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import { AssignmentInd, FitnessCenter, MonitorWeight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export interface AppShellProps
{
    children: ReactNode;
    pageTitle: string;
    pageIndex: number;
}

const AppShell = (props) =>
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
                }}
            >
                <h2>{props.pageTitle}</h2>
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
                        switch(value)
                        {
                            case 0:
                            {
                                navigate("../profile");
                                break;
                            }
                            case 1:
                            {
                                navigate("../workouts");
                                break;
                            }
                            case 2:
                            {
                                navigate("../weigh-in");
                                break;
                            }
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
                showLabels>
                <BottomNavigationAction 
                    label="Profile"
                    sx={{fontWeight: "bold"}}
                    icon=
                    {
                        <AssignmentInd sx={{fontSize: 50}}/>
                    }
                />
                <BottomNavigationAction 
                    label="Workouts"
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