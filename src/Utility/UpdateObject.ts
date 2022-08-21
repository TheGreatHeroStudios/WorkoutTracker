
export interface UpdateAction
{
    propertyName?: string;
    propertyValue: any;
}

export default function UpdateObject<TObj>(state: TObj | null, action: UpdateAction)
{
    const { propertyName, propertyValue } = action;
    
    return typeof state === typeof propertyValue ?
        propertyValue :
        { ...state, [propertyName]: propertyValue };
}