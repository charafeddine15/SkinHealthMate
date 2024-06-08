package com.ensaj.service.dto;

import com.ensaj.domain.Maladie;
import com.ensaj.domain.Stade;
import java.util.List;

public class StadeMaladieImage {

    Maladie maladie;
    List<Stade> stades;

    public StadeMaladieImage(Maladie maladie, List<Stade> stades) {
        this.maladie = maladie;
        this.stades = stades;
    }

    public StadeMaladieImage() {
        super();
    }

    public Maladie getMaladie() {
        return maladie;
    }

    public void setMaladie(Maladie maladie) {
        this.maladie = maladie;
    }

    public List<Stade> getStades() {
        return stades;
    }

    public void setStades(List<Stade> stades) {
        this.stades = stades;
    }
}
