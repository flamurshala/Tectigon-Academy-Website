'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LOGO2_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAtGVYSWZJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAEwIDAAEAAAABAAAAaYcEAAEAAABmAAAAAAAAAGAAAAABAAAAYAAAAAEAAAAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAAyAAAAAOgBAABAAAAZAAAAAAAAAB3+DqcAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGYWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI2LTA0LTA5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkRhdGE+eyZxdW90O2RvYyZxdW90OzomcXVvdDtEQUhHVzQxcVhDbyZxdW90OywmcXVvdDt1c2VyJnF1b3Q7OiZxdW90O1VBR0Q0R1lWTFBBJnF1b3Q7LCZxdW90O2JyYW5kJnF1b3Q7OiZxdW90O0VyaW9uIFByb2tzaGnigJlzIFRlYW0mcXVvdDt9PC9BdHRyaWI6RGF0YT4KICAgICA8QXR0cmliOkV4dElkPjg4NmZiY2Y2LTgwZjMtNDIyNC05YzY1LTkxMDRiZGFmY2NiOTwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz57IHF1ZXN0aW9uOiAmIzM5O1NpIG11bmQgdMOrIHJlZ2ppc3Ryb2hlbSBuw6sgbmrDqyBrdXJzPyYjMzk7LCBhbnN3ZXI6ICYjMzk7U2hmbGV0b25pIGthdGFsb2d1biBlIGt1cnNldmUsIHpnamlkaG5pIGt1cnNpbiBxw6sgZMOrc2hpcm9uaSBkaGUga2xpa29uaSAmcXVvdDtSZWdqaXN0cm9odSBUYW5pJnF1b3Q7LiBKdSBtdW5kIHRhIHDDq3JmdW5kb25pIHByb2Nlc2luIGUgcmVnamlzdHJpbWl0IG9ubGluZSBvc2UgdMOrIHZpeml0b25pIGthbXB1c2luIHRvbsOrLiYjMzk7LCB9LCB7IHF1ZXN0aW9uOiAtIDE8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+cmlvbjwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhIGRvYz1EQUhHVzQxcVhDbyB1c2VyPVVBR0Q0R1lWTFBBIGJyYW5kPUVyaW9uIFByb2tzaGnigJlzIFRlYW08L3htcDpDcmVhdG9yVG9vbD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSdyJz8+t7fs+QAAC/9JREFUeJztnAuwVWUVx5ULyDPwDRmgoGiYNhpYJpSmNFIpEAU+UEszqRFUslIxDSwt05xySolBU0PCMQoQMUDHtMeUlZNOKfYwSXs5EkPFhcu9fK3/2f/FXuy7z7n3XMS51/6/mTXf3t9777PW995njz2EEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBdj5TSnu2VjsRvT3m7WqeYpt7n7Oj7aSt+e/Jsq2zxf4QpRDdIlbCG3akwtfJnvaqF1UpXs84yANFuCi19H5OBJgPgbt++fa+yeK9WuYWerx/LdelRpY7FdH1DnSHdi/HE64jw43/MZK3JcpMHTFaarKKspN8Kk9Um30A6U+jPtrS0PGayEsI4UZDXGpObC4p2gsm9lv5JS/esyTMm6+z+F+Z/o8lgxhtq8gOWj7IfsDgPok50vZwVlv6H5h5tsr/JEpMfmcz2ZwxlT2a9nmbZLj81vy+bDGK8boX3g3TLLN5TqKvXG+VYXa4xdx/Ga4C7bdu2KXb9MOt+bCFPd99n8giep6mp6R0xTHQSwo91u0myH7s5VaeF7jq0nCaL2kjj8Z9IbKHN/YhJI/23F+L7/XMmw0wOC3kX45alG28yxNJsYL3uKTzjF9vKw5T+OUv3Zk+XMuO6pUYd3O/XJsPDe/1MiPNjkz70R34NvP6ERzCDmky/htfy9xdtkPIW8lRTjhtM5jY3N1+dMoNp4u/3kPnNQZjJ9XZ/MdPczfAN5n+jtYLXmjuP8SCfZ/wZjP9Wk41M8x+T20xmmkJeZu6slLXsblToOQZZuddYHtchP7v/XMqME8r/D3PmsYy5VH70OAeb/JV5LAjPOT0o7N8YfxbLvsTyWBXKRj186LRDiS3uSyHdpebONnk05IterBfSMV+wle4tzK8hGAh6bRhlixnIaR7+Wv7+ok5S3tpiuLKFinEp/RoKcRbxB34x5UOMspUoT/e1oExXel4pN1Ioz4qgWMfF9LxexfB1PmdJWavsdTo8GMjCkG4N/fBME0rK7hHyRsMwmuFP0A+G/c5iuvXr1/emYeA9IN14xrmc6VqyV1jpCScyrCdc87vQbU8G0slxJUt5y/m20Pq5MnenEnucdhlIKGMN46MF36+QZ0VprMc4y67/bfKKyemM04N1g6xmnTAM68vwWKdoIHfQ7yCTP9JvLf26sewewdAwb3g8ZXOHY0wGm7zIdEtjWbHO5p6RcmbSzw2kMeW9Jnq/of4+ZCBdkJS3xMe4gWAy7mFp59baDeRltI4m40xOMjkxCO4HML4PR34bW/9C+T02bty4DwyuLE40ELTeHp7KexA3kIMtrz/T7/6ycqu8g5EpG46B+TGsEO/UlA9Hr6Dfp/juYOhX0QWLPb0MpAtSp4Hcy/CySXqc0J7A+I/x/plqBtKO+nXEQIYFA1ka8hrA+Qsm4V9J2WrbV1M2N0IPOpRzHbCgWN9Q5gSTbYV3VTEQDrsw97o4vA9fXbuIaZIMpIvQEQOhcmwtyBa6UJDjGb9TGYj5vSnlw5/tfFY39vNNBpn8c1cMhO9hLMt7kHFeaWxsRK92tpctA+ki1GkgPsRCK3u8yQiTI6ikLrjvxXQ7hlgpH7/vWXD3hUKlbLg2OIbx+lUZYtF/b5M7U7ZqdV/K5h8+VDonZXMQN5D5JXVpc4iVsjnIu+g3yuqxnv7L0s7LvDKQrkAHDeSlTZs2+aS71nmqhxkfStKPYZUJb+hRpls4WnO0yGd6nJBXRwxkiMmf6LeSfg2UbsFYJ6UcGMgBIa/vFtLtmKRb3T/oibC8y3jRQMZ6/UOvgZ4Fk/YWGUgXoh4DMf/v8Mf+i8lAxikzEM9zYVDAC+i34xwT877PFcjy993luMxbj4EspB+M8HE+y7/MGVOoV6V8M8xvuZ6bnJIyw32Sfn83OTq+h1CnuGHqit7KQFK+0vbNEH+7DKQLUTCQxloGYu5ihmOFBsuaHzf5ZMqGDpAZKZucTmH8k8IYHwp3lcmHUrZMOtXkrpQvLT+U8v2TqIzwRy+0roaB+NJs3CicGYzzWdSzubl5aigbxrGF4dj7qKy8WX3nhHRP43mYbpoJlqSXhGf6eWJDETYK/9vU1OQG4s+Dnukphjdpkt6FCIqGVZwmGsCcQpi7C/gjb0vltDA9zlj5UZN5DKt1bONlU6rjYlmhfmsZB/sarQwEx0RSPm+4O4RDfFHBd8zLyt5kcrKnw9DP3PvbkQ7LwWNCPX0fBO/G5yBoYNxI3pPyeQsMZBL9ZSCdmZQrPybXaEnR2l5QCIutNQ4LojX8pcmvCoL0mJB/O6a1Fvg8cx+1XuB5HN9wMb/fMe5RjFs2XJufsvkEdtx3TPRTPkw7JGVznT+YzCvUty8V92dW9gterl1jSIaVtXvMHV2SJ07+zrbwn5j7QqgvhpboVdD7jGLcyjDKnvFcvju8g2qHFS9nub8xeXcME50ctnb97Yd7gytilXg9GKd/mTCsb4gfj3YcmLIJtMvAVFjVKimvD/PsV6Pe/RinVyw35I1VNaxQDWW5Q6uVnXbunfYqpDsI5cSyw3XP8F5a9QrMtyG8o+7FOKKLE5WuzjS1Pkxq9TFVVNIa+XWrlm+I48dE6i67VsuewtCpHup9d6KT0R4DSPn4vuanue3Nuz1K01a92lLoevKqlab4nB3JuyPli9cJbLFHpfC1Hv3dcPBF3odTdhT9vMQd95J4bzQ5IvqFOMem7GOmidyPGFfcpU/ZvARnxSZREP/0lB927M58epeUjWHgW3iNYeHolC84VOJwiDRGii7ahbfejY2Nh9oEGCtK0+gf9zxwIBGrQ/GbEBw3v8jzSPmKD85HYQLfi/d7hjjLrQzkgW9Frk3ZStWiwtwA562wc31lylbR5vErwH0Z3svunzf3/FBPn0hj0WBZyOs2m4CfzeuKoWAZ3K5viM8uRFWCcuEw3vLwZV/8mu6SlB/fqPhxiRafoPYPeQ3m6hL2XCbG+GzR8XntsEK52LibG/LAR05nxLReH7r4pgOrXjiO38v9t2zZgpU8rFQtCmmOStlejG+MYiUP34O0OhYjRCvCsAMrPktNjqRyv53hPjy5Cccu3C/lk2ycw+oX8vsoW/5x2OmmnxsChkbYeT+M977sO82NkvdfMJnK6zIDQW/2/ZTt68wK4fgaEsvKt3t5dGFwX+c1eqwZxbyFKCUo72kYnuDahiQXhs1GN5AvmZwV0xTyceXFsYxxuDYD+Z5djwhx3EBG+D1dzGvi14TzOMS6gsOt671shu/NXgDzkNU0mBNN7jB5P4yg8Gz9aVA3e5gQ7SLlewY4p/VpKtMEU25s7PUJig8DOTOmCWHuDqfCQnFxyhfzAf9iz78IjAbixjelYCDXpeyfWD6Q8iMiY0M4vgt5bMOGDQPYY+HfTe5M2cT75JQfVIxDxPdys/Co+AxCVCUo+iHYHTYXLf4SDkPwiez4EBet7zm89pYfSn81vtPgPSbev0/Zn0MgD/yVz9qQR3fmX+xBzq1ziAXDeGTz5s2Vz2HNWLBjXjkJzJWxRR6/YLw4O9Y75iVEVVI+2Y6rOn6sHR8gzQ9xcb+Y1650OEH7CBUfvQ3+q8qPfvSmP3qiCSzH5zkjvfyUTbLxX1SzQ1norabHOhbKRQ8C46tM9rdu3Yo/rDiUYZNjPUOakTTa/jEvIUoJitPTlA2tuh8p9yHJfikb5w/nPRT51pSd5cIy7nxLh4OIpzAcQ6G7PO+QD/4q59ZQLpQUZ6+wELAEeZjclLKJvy8YXMbeB8vBCzl8wt8aHcg8cMwEK1NDSsrDfslOhx55PYL5eAMgAxFtw1Z+UJnCpGzTLZ7LwpAKrTVOtmJSfEAIw5yj1TcmMMCYP5V7FOVIV/JCuTDGwxleicsl5Z6hHsgzDvV8uNgn1qvwnPvLMMRuIbbGRf/dlbcQnYJqylmmuCmVHzSsZUBl8aJUS1MrXj11biuNEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGE2GX+B/0eMheG85+wAAAAAElFTkSuQmCC'

const LOGO1_SRC =
  'data:image/png;base64,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'

const navLinks = [
  { name: 'Kryefaqja', href: '/' },
  { name: 'Trajnimet', href: '/courses' },
  { name: 'Rreth Nesh', href: '/about' },
  { name: 'Kontakti', href: '/contact' },
  { name: 'Verifiko Certifikatën', href: '/verify' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'glass py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 flex items-center justify-center"
              >
                <img
                  src={LOGO1_SRC}
                  alt="Tectigon Academy"
                  className=" -mr-5 h-25 w-20 object-contain"
                  draggable={false}
                />
              </motion.div>
              <img
                src={LOGO2_SRC}
                alt="Tectigon Academy"
                className="-ml-5 h-18 w-auto object-contain"
                draggable={false}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              >
                <Link href="/register">Regjistrohu Tani</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[280px] bg-card border-l border-border p-6 pt-20"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                        pathname === link.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="mt-4"
                >
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href="/register">Regjistrohu Tani</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
