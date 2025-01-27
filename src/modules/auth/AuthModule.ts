import { ContainerModule, interfaces } from "inversify";
import {TYPES} from "../../containers/container-types";
import {AuthService} from "./services/AuthService";
import {AuthController} from "./controller/AuthController";

export const AuthModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<AuthService>(TYPES.AuthService).to(AuthService);
    bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
});
