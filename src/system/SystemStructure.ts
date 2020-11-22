/**
 * The Interface who hold the System structure.
 * @usage Used when inheritance doesn't force function declarations.
 */
export interface SystemStructure {
    read(json): void;

    assignData(): void;
}