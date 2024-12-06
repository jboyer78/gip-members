import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFormFields } from "@/components/profile/ProfileFormFields";
import { useProfileForm } from "@/components/profile/useProfileForm";

const Profile = () => {
  const { form, onSubmit } = useProfileForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mon Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ProfileFormFields form={form} />
              <Button type="submit" className="w-full">
                Enregistrer les modifications
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;