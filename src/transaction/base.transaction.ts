export interface AIBase {
    translate(context: string, target: string): Promise<string>;
}