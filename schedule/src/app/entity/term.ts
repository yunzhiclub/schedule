import {BaseEntity} from './base-entity';

export interface Term extends BaseEntity {
  name: string;
  state: number;
  start_time: string;
  end_time: string;
}
