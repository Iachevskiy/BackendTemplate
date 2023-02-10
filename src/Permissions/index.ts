import {
    ResolversEnhanceMap,
    applyResolversEnhanceMap,
} from "@generated/type-graphql";

// указываем роутам доступные роли
import { Authorized } from "type-graphql";

// const resolversEnhanceMap: ResolversEnhanceMap = {
//     Category: {
//         createOneCategory: [Authorized('ADMIN')],
//     },
// };
//
// applyResolversEnhanceMap(resolversEnhanceMap);