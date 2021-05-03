export class ArtWorksModel {
  constructor(
    public id?: number,
    public titre?: string,
    public length?: string,
    public width?: string,
    public authors?: string,
    public era?: string,
    public style?: string,
    public materialTechnique?: string,
    public denomination?: string,
    public field?: string,
    public movements?: any[],
    public status?: any,
    public depositor?: string,
    public creationDate?: string,
    public visible?: boolean
  ) {}
}

export default class ArtWorksDataModel {
  constructor(
    public page?: number,
    public size?: number,
    public filteredQuantity?: number,
    public totalQuantity?: number,
    public results?: ArtWorksModel[]
  ) {}
}
