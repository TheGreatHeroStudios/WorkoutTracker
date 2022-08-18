
export interface UpdateAction<TProp>
{
    propertyName: string;
    propertyValue: TProp;
}

const UpdateObject: <TObject, TProp>(currentState:TObject, updateAction:UpdateAction<TProp>) => TObject =
    (currentState, updateAction) =>
    {
        const { propertyName, propertyValue } = updateAction;

        return { ...currentState, [propertyName]: propertyValue };
    }

export default UpdateObject;