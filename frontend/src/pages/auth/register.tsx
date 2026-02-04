import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Role } from '@parking/api-client'
import { useAuth } from '@/contexts/auth-context'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'
import type { ApiError } from '@/lib/api'

const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min 2 caractères)'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe requis (min 8 caractères)'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    setIsLoading(true)
    try {
      await registerUser({ ...data, role: Role.EMPLOYEE })
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              placeholder="Jean"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Nom"
              placeholder="Dupont"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="votre@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            hint="Minimum 8 caractères"
            error={errors.password?.message}
            {...register('password')}
          />
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Créer mon compte
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
