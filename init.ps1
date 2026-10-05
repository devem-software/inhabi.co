# 1. Cargar Oh My Posh (asegura que tenga diseño aunque sea una sesión aislada)
oh-my-posh init powershell --config "$env:POSH_THEMES_PATH/jandedobbeleer.omp.json" | Invoke-Expression

# 2. Abrir tu editor de texto en la carpeta actual
# (Si usas VS Code es 'code .', si usas Sublime es 'subl .', etc.)
zed .

# 3. Limpiar la pantalla para dejarla impecable
Clear-Host

# (Opcional) Un mensaje de bienvenida personalizado
Write-Host "¡Entorno del proyecto listo y limpio!" -ForegroundColor Green
