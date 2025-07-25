import { Check } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ContactBlock } ;
import RichText from '../../components/RichText';
import { FormBlock, FormBlockType } from '../Form/Component';

const Contact1: React.FC<ContactBlock> = ({ richText, form, contactBlocks, maps }) => {
  return (
    <section className="relative py-32">
      {/* Background gradients */}
      <div className="pointer-events-none absolute -inset-y-20 inset-x-0 bg-[radial-gradient(ellipse_35%_15%_at_40%_55%,hsl(from_var(--accent)_h_s_l)_0%,transparent_100%)] lg:bg-[radial-gradient(ellipse_12%_20%_at_60%_45%,hsl(from_var(--accent)_h_s_l)_0%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute -inset-y-20 inset-x-0 bg-[radial-gradient(ellipse_35%_20%_at_70%_75%,hsl(from_var(--accent)_h_s_l)_0%,transparent_80%)] lg:bg-[radial-gradient(ellipse_15%_30%_at_70%_65%,hsl(from_var(--accent)_h_s_l)_0%,transparent_80%)]"></div>
      {/* Background pattern */}
      <div className="pointer-events-none absolute -inset-y-20 inset-x-0 bg-[radial-gradient(hsl(from_var(--accent-foreground)_h_s_l/0.1)_1px,transparent_1px)] bg-size-[8px_8px] mask-[radial-gradient(ellipse_60%_60%_at_65%_50%,#000_0%,transparent_80%)]"></div>
      {/*
      <div className="container grid w-full grid-cols-1 gap-x-32 overflow-hidden lg:grid-cols-2">
        <div className="w-full pb-10 md:space-y-10 md:pb-0">
          <div className="space-y-4 md:max-w-160">
            {headlineAndDescription && <RichText publicContext={publicContext}
              content={headlineAndDescription}
              withWrapper={false}
              overrideStyle={{
                h1: 'text-4xl font-medium lg:text-5xl',
                h2: 'text-3xl font-medium lg:text-4xl',
                h3: 'text-2xl font-medium lg:text-3xl',
                h4: 'text-1xl font-medium lg:text-2xl',
                p: 'text-muted-foreground md:text-base lg:text-lg lg:leading-7',
              }}
            />}
          </div>
          <div className="hidden md:block">
            <div className="space-y-16 pb-20 lg:pb-0">
              <div className="space-y-6">
                <div className="mt-16 flex overflow-hidden">
                  <Avatar className="size-11">
                    <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-1.webp" />
                    <AvatarFallback>SB</AvatarFallback>
                  </Avatar>
                  <Avatar className="-ml-4 size-11">
                    <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-3.webp" />
                    <AvatarFallback>RA</AvatarFallback>
                  </Avatar>
                  <Avatar className="-ml-4 size-11">
                    <AvatarImage src="https://www.shadcnblocks.com/images/block/avatar-2.webp" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-semibold">What you can expect:</p>
                  <div className="flex items-center space-x-2.5">
                    <Check className="size-5 shrink-0 text-muted-foreground" />
                    <p className="text-sm">
                      Detailed product presentation tailored to you
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Check className="size-5 shrink-0 text-muted-foreground" />
                    <p className="text-sm">
                      Consulting on your messaging strategy
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Check className="size-5 shrink-0 text-muted-foreground" />
                    <p className="text-sm">
                      Answers to all the questions you have
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-12">
                <img
                  src="https://www.shadcnblocks.com/images/block/logos/astro.svg"
                  alt="placeholder"
                  className="h-6"
                />
                <img
                  src="https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg"
                  alt="placeholder"
                  className="h-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center lg:mt-2.5">
          <div className="relative flex w-full min-w-80 max-w-120 flex-col items-center overflow-visible md:min-w-96">
            <div className="z-10 space-y-6">
              <div className="w-full space-y-6 rounded-xl border border-border bg-background px-6 py-10 shadow-xs">
                {form?.[0] && <FormBlock {...form?.[0] as FormBlockType} withoutWrapper={true} />}
              </div>
            </div>
            {/* <form className="z-10 space-y-6">
              <div className="w-full space-y-6 rounded-xl border border-border bg-background px-6 py-10 shadow-xs">
                <div>
                  <div className="mb-2.5 text-sm font-medium">
                    <label htmlFor="fullName">Full name</label>
                  </div>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Joe Average"
                  />
                </div>
                <div>
                  <div className="mb-2.5 text-sm font-medium">
                    <label htmlFor="company">Company</label>
                  </div>
                  <Input id="company" name="company" placeholder="Acme Corp" />
                </div>
                <div>
                  <div className="mb-2.5 text-sm font-medium">
                    <label htmlFor="phone">Phone number</label>
                  </div>
                  <Input id="phone" name="phone" placeholder="12 3456 7890" />
                </div>
                <div>
                  <div className="mb-2.5 text-sm font-medium">
                    <label htmlFor="email">Email (busienss)</label>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <div className="mb-2.5 text-sm font-medium">
                    <label htmlFor="country">Country</label>
                  </div>
                  <Select>
                    <SelectTrigger id="country" name="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aus">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-2.5 text-sm font-medium">
                    <label htmlFor="companySize">Company size</label>
                  </div>
                  <Select>
                    <SelectTrigger id="companySize" name="companySize">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="200+">200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-2.5 text-sm font-medium">
                    <label htmlFor="id">
                      How did you hear about us?{' '}
                      <span className="text-muted-foreground">(Optional)</span>
                    </label>
                  </div>
                  <Select>
                    <SelectTrigger id="referral" name="referral">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="search">Web Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full flex-col justify-end space-y-3 pt-2">
                  <Button type="submit">Book demo</Button>
                  <div className="text-xs text-muted-foreground">
                    For more information about how we handle your personal
                    information, please visit our{' '}
                    <a href="#" className="underline">
                      privacy policy
                    </a>
                    .
                  </div>
                </div>
              </div>
            </form> 
          </div>
        </div>
      </div>
      */}
    </section>
  );
};

export default Contact1;
