#include <stdio.h>
#include <pthread.h>
struct DATA {
  int  key;
  int  value;
}  ;

struct DATA data[15] = { {1, 100},
             {5,200},
             {6, 300},
             {7, 700},
             {8, 900},
             {9, 250},
             {10, 400},
             {11, 600},
             {12, 800},
             {13, 1500},
             {14, 1200},
             {15, 110},
             {16, 140},
             {17, 133},
             {18, 10} };

int binary_search(int x)
{
  int fvalue, mid, up, low ;

  low = 0;
  up = 14;
  fvalue = -1 /* all data are positive */ ;
  while (low <= up) {
    mid = (low + up) >> 1;
    if ( data[mid].key == x ) {  /*  found  */
      up = low - 1;
      fvalue = data[mid].value;
    }
    else  /* not found */
      if ( data[mid].key > x )  {
        up = mid - 1;
      }
      else   {
                low = mid + 1;
      }
  }
  return fvalue;
}

long diffclk(struct timespec *d, struct timespec *f) {
  long diff=(f->tv_nsec-d->tv_nsec);
  diff+=(f->tv_sec-d->tv_sec)*1000000000;
  return diff;
}

int main(void)
{
        struct timespec debut, fin;
        clock_gettime(CLOCK_MONOTONIC,&debut);
        for (int i=0;i<100;i++) {
          binary_search(8);
        }
        clock_gettime(CLOCK_MONOTONIC,&fin);
        printf("Durée: %ld ns\n",diffclk(&debut,&fin));
        return 0;
}