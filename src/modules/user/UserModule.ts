import { ContainerModule, interfaces } from "inversify";
import {TYPES} from "../../containers/container-types";
import {UserController} from "./controller/UserController";
import {UserService} from "./services/UserService";

export const UserModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<UserService>(TYPES.UserService).to(UserService);
    bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
});
