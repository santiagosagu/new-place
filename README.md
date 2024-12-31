# Bienvenido a new place👋

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo run android
   ```

## Deploy preview

1.  limpiar el proyecto

```bash
npx expo prebuild --clean
```

2.  generar el proyecto

```bash
npx expo prebuild
```

3.  Configuracion de eas

```bash
eas build:configure
```

4. Ejecutar el build

   ```bash
   eas build --profile preview --platform android
   ```
