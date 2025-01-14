export interface UsuarioT {
    id              : number;
    run             : string;
    nombres         : string;
    apellido_paterno: string;
    apellido_materno: string;
    correo          : string;
    servicio        : ServicioT;
    perfil          : PerfilT;
    estado          : EstadoUsuarioT;
    token           : string;
}

interface ServicioT {
    id    : number;
    nombre: string;
}

interface PerfilT {
    id  : number;
    tipo: string;
}

interface EstadoUsuarioT {
    id    : number;
    estado: string;
}