import { AppShellAction } from "../Layout/AppShell";

export interface WorkoutTrackerPageProps
{
    SetPageTitle: (overriddenPageTitle: string) => void;
    appShellActionState:
    [
        appShellActions: Map<AppShellAction, () => void>,
        SetAppShellActions: (actions: Map<AppShellAction, () => void>) => void
    ]
}