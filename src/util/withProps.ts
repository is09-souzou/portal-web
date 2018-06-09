import { ThemedStyledFunction } from "styled-components";

export default <U>() => <P, T, O>(func: ThemedStyledFunction<P, T, O>) =>
    func as ThemedStyledFunction<P & U, T, O & U>;
