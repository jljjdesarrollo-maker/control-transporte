# Restauración Completa — v2.7-admin-edit-fecha-aprobada

## Restaurar Código
```bash
cd control-transporte
git fetch --tags
git checkout v2.7-admin-edit-fecha-aprobada
git checkout -b restore-v2.7
```

## Restaurar Base de Datos
1. Ir a Vercel → Proyecto → Storage → Prisma Postgres → Open Console
2. Ejecutar SQL de respaldo desde: `/home/z/my-project/download/backups/backup_v2.7-admin-edit-fecha.json`

## Restaurar desde Cero
```bash
git clone https://github.com/jljjdesarrollo-maker/control-transporte.git
cd control-transporte
git checkout v2.7-admin-edit-fecha-aprobada
npm install
npx prisma generate
npx prisma db push --accept-data-loss --skip-generate
npm run build
```

## Commits Incluidos
- 34d2780 fix: Historial por defecto en 'Semana' en lugar de 'Todos'
- d571ceb feat: admin puede editar fecha de operacion desde RecordDetail
- bc1393a fix: PDF usa fecha de operacion + incluye VT en nombre archivo y WhatsApp
- a9196d3 feat: Comparar Frecuencias - herramienta para decidir cambios de frecuencia
- 8adc11b fix: ordenar VTs numericamente
