'use client'

import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LogoutDemo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Logout Button Variants</CardTitle>
            <CardDescription>
              Different styles and sizes of logout buttons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Default</h3>
                <LogoutButton />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Destructive</h3>
                <LogoutButton variant="destructive" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Outline</h3>
                <LogoutButton variant="outline" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Secondary</h3>
                <LogoutButton variant="secondary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Small Size</h3>
                <LogoutButton size="sm" variant="outline" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Large Size</h3>
                <LogoutButton size="lg" variant="default" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Icon Only</h3>
                <LogoutButton size="icon" variant="ghost" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Custom Text</h3>
                <LogoutButton variant="destructive" showIcon={false}>
                  Sign Out
                </LogoutButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
