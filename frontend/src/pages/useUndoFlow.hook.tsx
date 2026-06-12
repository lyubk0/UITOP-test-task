import UndoToast from '@/components/common/UndoToast'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface PendingAction {
	timeoutId: ReturnType<typeof setTimeout>
}

export const UNDO_DELAY_MS = 5000

export function useUndoFlow() {
	const [pendingActions, setPendingActions] = useState<
		Map<number, PendingAction>
	>(new Map())

	const clearPending = useCallback((id: number) => {
		setPendingActions(prev => {
			const next = new Map(prev)
			next.delete(id)
			return next
		})
	}, [])

	const schedule = useCallback(
		(
			todoId: number,
			message: string,
			onCommit: () => Promise<void>,
			onRestore: () => void,
		) => {
			const timeoutId = setTimeout(async () => {
				clearPending(todoId)
				await onCommit()
			}, UNDO_DELAY_MS)

			setPendingActions(prev => new Map(prev).set(todoId, { timeoutId }))

			toast(
				t => (
					<UndoToast
						message={message}
						onUndo={() => {
							clearTimeout(timeoutId)
							clearPending(todoId)
							onRestore()
							toast.dismiss(t.id)
						}}
					/>
				),
				{ duration: UNDO_DELAY_MS },
			)
		},
		[clearPending],
	)

	const pendingIds = new Set(pendingActions.keys())

	return { schedule, pendingIds }
}
