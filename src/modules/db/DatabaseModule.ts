import { ContainerModule, interfaces } from "inversify";
import {TYPES} from "../../containers/container-types";
import {DatabaseService} from "./DatabaseService";

export const DatabaseModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
});
