export function formatDate(isoString: string) {
    const date = new Date(isoString)
    const formatter = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
    return formatter.format(date)
}