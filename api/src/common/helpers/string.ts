export const snakeToCamel = str => str.replace( /([-_]\w)/g, g => g[ 1 ].toUpperCase() );
export const snakeToPascal = str => {
    let camelCase = snakeToCamel( str );
    let pascalCase = camelCase[ 0 ].toUpperCase() + camelCase.substr( 1 );
    return pascalCase;
}