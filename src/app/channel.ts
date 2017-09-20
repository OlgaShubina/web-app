export class Channel {
  id: number;
  name: string;
  type: string;
  units: string;
  condition: string;
  threshold: string;
  is_log: string;
  description: string;
  cas_type: string;

  constructor(channelId: number, channelName: string, channelType: string, units: string, channelCondition: string,  is_log: string, description: string, cas_type: string){
    this.id = channelId;
    this.name = channelName;
    this.type = channelType;
    this.condition = channelCondition;
    this.units = units;
    this.is_log = is_log;
    this.description = description;
    this.cas_type = cas_type;
  }
}
